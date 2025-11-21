// Dialogue Agent - Generates character dialogues

import { LLMService } from '../services/llm';
import type { Env, AgentInput, AgentOutput, Dialogue, Character } from '../types';

export class DialogueAgent {
  private llm: LLMService;
  private env: Env;

  constructor(env: Env) {
    this.env = env;
    this.llm = new LLMService(env);
  }

  async generate(input: AgentInput & { characterId: number; sceneName: string; sceneContext: string }): Promise<AgentOutput> {
    const startTime = Date.now();
    
    try {
      // Fetch character context
      const character = await this.env.DB.prepare(
        'SELECT * FROM characters WHERE id = ?'
      ).bind(input.characterId).first<Character>();

      if (!character) {
        throw new Error('Character not found');
      }

      const systemPrompt = `你是一位对话脚本作家，能够写出符合角色性格的生动对话。
你的任务是为特定角色在特定场景下创作对话内容。

要求：
1. 对话要符合角色性格和背景
2. 对话要推动剧情发展
3. 包含情感变化和语气特征
4. 自然流畅，有感染力

输出格式为 JSON：
{
  "dialogues": [
    {
      "text": "对话内容",
      "emotion": "情感状态（如：愤怒、喜悦、悲伤等）",
      "action": "可选的动作描述"
    }
  ]
}`;

      const userPrompt = `请为以下角色在指定场景中创作对话：

角色信息：
- 名字：${character.name}
- 角色：${character.role}
- 性格：${character.personality}
- 背景：${character.background}

场景名称：${input.sceneName}
场景情境：${input.sceneContext}

请创作5-8段符合角色性格的对话。`;

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
          dialogues: [{ text: response.content, emotion: 'neutral' }]
        };
      }

      // Save to database
      const dialogue: Dialogue = {
        project_id: input.projectId,
        character_id: input.characterId,
        scene_name: input.sceneName,
        content: JSON.stringify(parsedData.dialogues),
        emotion: parsedData.dialogues[0]?.emotion || 'neutral',
        context: input.sceneContext,
        raw_content: response.content,
        model_used: response.model,
      };

      const result = await this.env.DB.prepare(
        `INSERT INTO dialogues (project_id, character_id, scene_name, content, emotion, context, raw_content, model_used)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        dialogue.project_id,
        dialogue.character_id,
        dialogue.scene_name,
        dialogue.content,
        dialogue.emotion,
        dialogue.context,
        dialogue.raw_content,
        dialogue.model_used
      ).run();

      const dialogueId = result.meta.last_row_id;
      const duration = Date.now() - startTime;

      // Log generation
      await this.logGeneration(input.projectId, 'dialogue', input, parsedData, response.model, response.tokens, duration, 'success');

      return {
        success: true,
        data: { ...dialogue, id: dialogueId },
        model_used: response.model,
        tokens: response.tokens,
        duration_ms: duration,
      };

    } catch (error: any) {
      const duration = Date.now() - startTime;
      await this.logGeneration(input.projectId, 'dialogue', input, null, 'unknown', 0, duration, 'error', error.message);
      
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
