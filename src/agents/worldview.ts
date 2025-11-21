// Worldview Agent - Generates game world settings

import { LLMService } from '../services/llm';
import type { Env, AgentInput, AgentOutput, Worldview } from '../types';

export class WorldviewAgent {
  private llm: LLMService;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.llm = new LLMService(env);
  }

  async generate(input: AgentInput & { gameType: string; theme: string }): Promise<AgentOutput> {
    const startTime = Date.now();
    
    try {
      const systemPrompt = `你是一位资深游戏世界观设计师，擅长构建完整、有深度的游戏世界。
你的任务是根据游戏类型和主题，创建一个引人入胜的世界观框架。

要求：
1. 历史：构建世界的历史背景，包括重大事件、时代变迁
2. 地理：描述世界的地理环境、重要地点、气候特征
3. 文化：阐述世界的文化体系、信仰、社会结构
4. 传说：创造世界中的神话、传说、重要故事

输出格式为 JSON：
{
  "title": "世界观标题",
  "history": "历史背景描述",
  "geography": "地理环境描述",
  "culture": "文化体系描述",
  "lore": "传说故事描述"
}`;

      const userPrompt = `请为以下游戏创建世界观：
- 游戏类型：${input.gameType}
- 主题：${input.theme}

请创建一个详细、有深度且具有可玩性的游戏世界观。`;

      const response = await this.llm.call(userPrompt, systemPrompt, 'openai', 'gpt-4o-mini');
      
      // Parse JSON from response
      let parsedData;
      try {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/) || 
                         response.content.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : response.content;
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        // If parsing fails, return raw content
        parsedData = {
          title: `${input.theme} 世界观`,
          raw_content: response.content
        };
      }

      // Save to database
      const worldview: Worldview = {
        project_id: input.projectId,
        title: parsedData.title || `${input.theme} 世界观`,
        history: parsedData.history,
        geography: parsedData.geography,
        culture: parsedData.culture,
        lore: parsedData.lore,
        raw_content: response.content,
        model_used: response.model,
      };

      const result = await this.env.DB.prepare(
        `INSERT INTO worldviews (project_id, title, history, geography, culture, lore, raw_content, model_used)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        worldview.project_id,
        worldview.title,
        worldview.history,
        worldview.geography,
        worldview.culture,
        worldview.lore,
        worldview.raw_content,
        worldview.model_used
      ).run();

      const worldviewId = result.meta.last_row_id;
      const duration = Date.now() - startTime;

      // Log generation
      await this.logGeneration(input.projectId, 'worldview', input, parsedData, response.model, response.tokens, duration, 'success');

      return {
        success: true,
        data: { ...worldview, id: worldviewId },
        model_used: response.model,
        tokens: response.tokens,
        duration_ms: duration,
      };

    } catch (error: any) {
      const duration = Date.now() - startTime;
      await this.logGeneration(input.projectId, 'worldview', input, null, 'unknown', 0, duration, 'error', error.message);
      
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
