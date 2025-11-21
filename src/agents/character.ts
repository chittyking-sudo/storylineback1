// Character Agent - Generates game characters

import { LLMService } from '../services/llm';
import type { Env, AgentInput, AgentOutput, Character, Worldview, Storyline } from '../types';

export class CharacterAgent {
  private llm: LLMService;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.llm = new LLMService(env);
  }

  async generate(input: AgentInput & { worldviewId: number; characterCount?: number }): Promise<AgentOutput> {
    const startTime = Date.now();
    
    try {
      // Fetch worldview and storyline context
      const worldview = await this.env.DB.prepare(
        'SELECT * FROM worldviews WHERE id = ?'
      ).bind(input.worldviewId).first<Worldview>();

      if (!worldview) {
        throw new Error('Worldview not found');
      }

      const storylines = await this.env.DB.prepare(
        'SELECT * FROM storylines WHERE worldview_id = ?'
      ).bind(input.worldviewId).all<Storyline>();

      const characterCount = input.characterCount || 5;

      const systemPrompt = `你是一位角色设计专家，擅长创建立体、有深度的游戏角色。
你的任务是基于世界观和剧情，创建丰富的角色群像。

要求：
1. 创建${characterCount}个角色（包括主角、配角、NPC）
2. 每个角色要有独特的性格、背景和动机
3. 角色之间要有合理的关系网络
4. 角色要符合世界观设定

输出格式为 JSON 数组：
[
  {
    "name": "角色名字",
    "role": "角色定位（主角/配角/NPC）",
    "personality": "性格特征描述",
    "background": "背景故事",
    "appearance": "外貌描述",
    "motivations": "动机和目标",
    "relationships": "与其他角色的关系"
  }
]`;

      const storylineSummary = storylines.results.length > 0 
        ? storylines.results[0].summary 
        : '待定剧情';

      const userPrompt = `基于以下信息，请创建${characterCount}个游戏角色：

世界观信息：
- 标题：${worldview.title}
- 历史：${worldview.history || '无'}
- 文化：${worldview.culture || '无'}

剧情概要：
${storylineSummary}

请创建角色时确保：
1. 每个角色都有鲜明个性
2. 角色群像多样化
3. 符合世界观设定`;

      const response = await this.llm.call(userPrompt, systemPrompt, 'openai', 'gpt-4o-mini');
      
      // Parse JSON from response
      let characters;
      try {
        const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/) || 
                         response.content.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : response.content;
        characters = JSON.parse(jsonStr);
      } catch (e) {
        throw new Error(`Failed to parse character data: ${e}`);
      }

      // Save all characters to database
      const savedCharacters = [];
      for (const char of characters) {
        const character: Character = {
          project_id: input.projectId,
          worldview_id: input.worldviewId,
          name: char.name,
          role: char.role,
          personality: char.personality,
          background: char.background,
          appearance: char.appearance,
          motivations: char.motivations,
          relationships: char.relationships,
          raw_content: JSON.stringify(char),
          model_used: response.model,
        };

        const result = await this.env.DB.prepare(
          `INSERT INTO characters (project_id, worldview_id, name, role, personality, background, appearance, motivations, relationships, raw_content, model_used)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          character.project_id,
          character.worldview_id,
          character.name,
          character.role,
          character.personality,
          character.background,
          character.appearance,
          character.motivations,
          character.relationships,
          character.raw_content,
          character.model_used
        ).run();

        savedCharacters.push({ ...character, id: result.meta.last_row_id });
      }

      const duration = Date.now() - startTime;

      // Log generation
      await this.logGeneration(input.projectId, 'character', input, characters, response.model, response.tokens, duration, 'success');

      return {
        success: true,
        data: savedCharacters,
        model_used: response.model,
        tokens: response.tokens,
        duration_ms: duration,
      };

    } catch (error: any) {
      const duration = Date.now() - startTime;
      await this.logGeneration(input.projectId, 'character', input, null, 'unknown', 0, duration, 'error', error.message);
      
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
