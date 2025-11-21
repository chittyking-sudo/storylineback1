// Storyline Agent - Generates main and side storylines

import { LLMService } from '../services/llm';
import type { Env, AgentInput, AgentOutput, Storyline, Worldview } from '../types';

export class StorylineAgent {
  private llm: LLMService;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.llm = new LLMService(env);
  }

  async generate(input: AgentInput & { worldviewId: number }): Promise<AgentOutput> {
    const startTime = Date.now();
    
    try {
      // Fetch worldview context
      const worldview = await this.env.DB.prepare(
        'SELECT * FROM worldviews WHERE id = ?'
      ).bind(input.worldviewId).first<Worldview>();

      if (!worldview) {
        throw new Error('Worldview not found');
      }

      const systemPrompt = `你是一位专业的游戏编剧大师，精通三幕结构、英雄之旅等叙事理论。
你的任务是基于给定的世界观，创建引人入胜的游戏剧情。

要求：
1. 设计主线剧情的三幕结构（起、承、转、合）
2. 创建戏剧冲突和张力点
3. 设计角色成长弧线
4. 加入支线剧情的可能性

输出格式为 JSON：
{
  "title": "剧情标题",
  "summary": "剧情概要（200-300字）",
  "acts": "分幕详细描述",
  "conflicts": "主要冲突点描述"
}`;

      const userPrompt = `基于以下世界观，请创建一个主线剧情：

世界观信息：
- 标题：${worldview.title}
- 历史：${worldview.history || '无'}
- 地理：${worldview.geography || '无'}
- 文化：${worldview.culture || '无'}
- 传说：${worldview.lore || '无'}

请创建一个有深度、有张力、能够展现这个世界特色的主线剧情。`;

      const response = await this.llm.call(userPrompt, systemPrompt, 'openai', 'gpt-4o-mini');
      
      // Parse JSON from response
      let parsedData;
      try {
        const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/) || 
                         response.content.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : response.content;
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        parsedData = {
          title: '主线剧情',
          raw_content: response.content
        };
      }

      // Save to database
      const storyline: Storyline = {
        project_id: input.projectId,
        worldview_id: input.worldviewId,
        type: 'main',
        title: parsedData.title || '主线剧情',
        summary: parsedData.summary,
        acts: parsedData.acts,
        conflicts: parsedData.conflicts,
        raw_content: response.content,
        model_used: response.model,
      };

      const result = await this.env.DB.prepare(
        `INSERT INTO storylines (project_id, worldview_id, type, title, summary, acts, conflicts, raw_content, model_used)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        storyline.project_id,
        storyline.worldview_id,
        storyline.type,
        storyline.title,
        storyline.summary,
        storyline.acts,
        storyline.conflicts,
        storyline.raw_content,
        storyline.model_used
      ).run();

      const storylineId = result.meta.last_row_id;
      const duration = Date.now() - startTime;

      // Log generation
      await this.logGeneration(input.projectId, 'storyline', input, parsedData, response.model, response.tokens, duration, 'success');

      return {
        success: true,
        data: { ...storyline, id: storylineId },
        model_used: response.model,
        tokens: response.tokens,
        duration_ms: duration,
      };

    } catch (error: any) {
      const duration = Date.now() - startTime;
      await this.logGeneration(input.projectId, 'storyline', input, null, 'unknown', 0, duration, 'error', error.message);
      
      return {
        success: false,
        error: error.message,
        duration_ms: duration,
      };
    }
  }

  private async logGeneration(
    projectId: number,
    agentType: string,
    input: any,
    output: any,
    model: string,
    tokens: number | undefined,
    duration: number,
    status: string,
    errorMessage?: string
  ) {
    await this.env.DB.prepare(
      `INSERT INTO generation_logs (project_id, agent_type, input_data, output_data, model_used, tokens_used, duration_ms, status, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      projectId,
      agentType,
      JSON.stringify(input),
      output ? JSON.stringify(output) : null,
      model,
      tokens || 0,
      duration,
      status,
      errorMessage || null
    ).run();
  }
}
