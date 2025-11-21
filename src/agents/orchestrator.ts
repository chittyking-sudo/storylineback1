// Master Orchestrator - Coordinates all agents in sequence

import { WorldviewAgent } from './worldview';
import { StorylineAgent } from './storyline';
import { CharacterAgent } from './character';
import { DialogueAgent } from './dialogue';
import type { Env } from '../types';

export interface OrchestrationInput {
  projectName: string;
  gameType: string;
  theme: string;
  characterCount?: number;
  generateDialogues?: boolean;
}

export interface OrchestrationResult {
  success: boolean;
  projectId?: number;
  worldview?: any;
  storyline?: any;
  characters?: any[];
  dialogues?: any[];
  errors?: string[];
  totalDuration?: number;
  totalTokens?: number;
}

export class MasterOrchestrator {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  /**
   * Orchestrate the complete game content generation pipeline
   */
  async generate(input: OrchestrationInput): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let totalTokens = 0;

    try {
      // Step 1: Create project
      console.log('Step 1: Creating project...');
      const projectResult = await this.env.DB.prepare(
        'INSERT INTO projects (name, game_type, theme, status) VALUES (?, ?, ?, ?)'
      ).bind(input.projectName, input.gameType, input.theme, 'generating').run();

      const projectId = projectResult.meta.last_row_id as number;
      console.log(`Project created with ID: ${projectId}`);

      // Step 2: Generate worldview
      console.log('Step 2: Generating worldview...');
      const worldviewAgent = new WorldviewAgent(this.env);
      const worldviewResult = await worldviewAgent.generate({
        projectId,
        gameType: input.gameType,
        theme: input.theme,
      });

      if (!worldviewResult.success) {
        errors.push(`Worldview generation failed: ${worldviewResult.error}`);
        await this.updateProjectStatus(projectId, 'failed');
        return { success: false, errors };
      }

      totalTokens += worldviewResult.tokens || 0;
      const worldviewId = worldviewResult.data.id;
      console.log(`Worldview generated with ID: ${worldviewId}`);

      // Step 3: Generate storyline
      console.log('Step 3: Generating storyline...');
      const storylineAgent = new StorylineAgent(this.env);
      const storylineResult = await storylineAgent.generate({
        projectId,
        worldviewId,
      });

      if (!storylineResult.success) {
        errors.push(`Storyline generation failed: ${storylineResult.error}`);
      } else {
        totalTokens += storylineResult.tokens || 0;
        console.log(`Storyline generated with ID: ${storylineResult.data.id}`);
      }

      // Step 4: Generate characters
      console.log('Step 4: Generating characters...');
      const characterAgent = new CharacterAgent(this.env);
      const characterResult = await characterAgent.generate({
        projectId,
        worldviewId,
        characterCount: input.characterCount || 5,
      });

      if (!characterResult.success) {
        errors.push(`Character generation failed: ${characterResult.error}`);
      } else {
        totalTokens += characterResult.tokens || 0;
        console.log(`Generated ${characterResult.data.length} characters`);
      }

      // Step 5: Generate dialogues (optional)
      let dialogues: any[] = [];
      if (input.generateDialogues && characterResult.success && characterResult.data.length > 0) {
        console.log('Step 5: Generating sample dialogues...');
        const dialogueAgent = new DialogueAgent(this.env);
        
        // Generate dialogue for the first character as a sample
        const firstCharacter = characterResult.data[0];
        const dialogueResult = await dialogueAgent.generate({
          projectId,
          characterId: firstCharacter.id,
          sceneName: '开场场景',
          sceneContext: '主角登场，介绍自己的背景和目标',
        });

        if (!dialogueResult.success) {
          errors.push(`Dialogue generation failed: ${dialogueResult.error}`);
        } else {
          totalTokens += dialogueResult.tokens || 0;
          dialogues.push(dialogueResult.data);
          console.log('Sample dialogue generated');
        }
      }

      // Step 6: Update project status
      const finalStatus = errors.length === 0 ? 'completed' : 'partial';
      await this.updateProjectStatus(projectId, finalStatus);

      const totalDuration = Date.now() - startTime;

      console.log(`\n=== Generation Complete ===`);
      console.log(`Project ID: ${projectId}`);
      console.log(`Status: ${finalStatus}`);
      console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
      console.log(`Total Tokens: ${totalTokens}`);
      console.log(`Errors: ${errors.length}`);

      return {
        success: errors.length === 0,
        projectId,
        worldview: worldviewResult.data,
        storyline: storylineResult.success ? storylineResult.data : null,
        characters: characterResult.success ? characterResult.data : [],
        dialogues,
        errors: errors.length > 0 ? errors : undefined,
        totalDuration,
        totalTokens,
      };

    } catch (error: any) {
      console.error('Orchestration error:', error);
      return {
        success: false,
        errors: [error.message],
      };
    }
  }

  private async updateProjectStatus(projectId: number, status: string) {
    await this.env.DB.prepare(
      'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, projectId).run();
  }

  /**
   * Get project details with all generated content
   */
  async getProject(projectId: number) {
    const project = await this.env.DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(projectId).first();

    if (!project) {
      return null;
    }

    const worldviews = await this.env.DB.prepare(
      'SELECT * FROM worldviews WHERE project_id = ?'
    ).bind(projectId).all();

    const storylines = await this.env.DB.prepare(
      'SELECT * FROM storylines WHERE project_id = ?'
    ).bind(projectId).all();

    const characters = await this.env.DB.prepare(
      'SELECT * FROM characters WHERE project_id = ?'
    ).bind(projectId).all();

    const dialogues = await this.env.DB.prepare(
      'SELECT * FROM dialogues WHERE project_id = ?'
    ).bind(projectId).all();

    const logs = await this.env.DB.prepare(
      'SELECT * FROM generation_logs WHERE project_id = ? ORDER BY created_at DESC'
    ).bind(projectId).all();

    return {
      project,
      worldviews: worldviews.results,
      storylines: storylines.results,
      characters: characters.results,
      dialogues: dialogues.results,
      logs: logs.results,
    };
  }

  /**
   * List all projects
   */
  async listProjects() {
    const result = await this.env.DB.prepare(
      'SELECT * FROM projects ORDER BY created_at DESC LIMIT 50'
    ).all();

    return result.results;
  }
}
