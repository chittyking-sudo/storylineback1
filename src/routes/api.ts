// API Routes for the multi-agent game generator

import { Hono } from 'hono';
import { MasterOrchestrator } from '../agents/orchestrator';
import type { Env } from '../types';

const api = new Hono<{ Bindings: Env }>();

/**
 * POST /api/generate - Start a new game content generation
 */
api.post('/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { projectName, gameType, theme, characterCount, generateDialogues } = body;

    if (!projectName || !gameType || !theme) {
      return c.json({
        error: 'Missing required fields: projectName, gameType, theme'
      }, 400);
    }

    const orchestrator = new MasterOrchestrator(c.env);
    const result = await orchestrator.generate({
      projectName,
      gameType,
      theme,
      characterCount: characterCount || 5,
      generateDialogues: generateDialogues !== false,
    });

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/projects - List all projects
 */
api.get('/projects', async (c) => {
  try {
    const orchestrator = new MasterOrchestrator(c.env);
    const projects = await orchestrator.listProjects();
    return c.json({ projects });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/projects/:id - Get project details
 */
api.get('/projects/:id', async (c) => {
  try {
    const projectId = parseInt(c.req.param('id'));
    const orchestrator = new MasterOrchestrator(c.env);
    const project = await orchestrator.getProject(projectId);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json(project);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/projects/:id/export - Export project as JSON
 */
api.get('/projects/:id/export', async (c) => {
  try {
    const projectId = parseInt(c.req.param('id'));
    const format = c.req.query('format') || 'json';
    const orchestrator = new MasterOrchestrator(c.env);
    const project = await orchestrator.getProject(projectId);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    if (format === 'json') {
      return c.json(project);
    } else if (format === 'markdown') {
      const markdown = generateMarkdown(project);
      return c.text(markdown, 200, {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="project-${projectId}.md"`
      });
    } else {
      return c.json({ error: 'Unsupported format. Use json or markdown' }, 400);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/generate/worldview - Generate only worldview
 */
api.post('/generate/worldview', async (c) => {
  try {
    const body = await c.req.json();
    const { projectName, gameType, theme, models } = body;

    if (!projectName || !gameType || !theme) {
      return c.json({
        error: 'Missing required fields: projectName, gameType, theme'
      }, 400);
    }

    const orchestrator = new MasterOrchestrator(c.env);
    const result = await orchestrator.generateWorldviewOnly({
      projectName,
      gameType,
      theme,
      models: models || ['openai']
    });

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/generate/characters - Generate characters for existing worldview
 */
api.post('/generate/characters', async (c) => {
  try {
    const body = await c.req.json();
    const { projectId, worldviewId, characterCount, models } = body;

    if (!projectId || !worldviewId) {
      return c.json({
        error: 'Missing required fields: projectId, worldviewId'
      }, 400);
    }

    const orchestrator = new MasterOrchestrator(c.env);
    const result = await orchestrator.generateCharactersOnly({
      projectId,
      worldviewId,
      characterCount: characterCount || 5,
      models: models || ['openai']
    });

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/generate/dialogue - Generate dialogue for specific characters
 */
api.post('/generate/dialogue', async (c) => {
  try {
    const body = await c.req.json();
    const { projectId, characterIds, sceneName, sceneContext } = body;

    if (!projectId || !characterIds || characterIds.length === 0) {
      return c.json({
        error: 'Missing required fields: projectId, characterIds'
      }, 400);
    }

    const orchestrator = new MasterOrchestrator(c.env);
    const result = await orchestrator.generateDialogueForCharacters({
      projectId,
      characterIds,
      sceneName: sceneName || '默认场景',
      sceneContext: sceneContext || '角色之间的日常对话'
    });

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/test/models - Test multiple models with same prompt
 */
api.post('/test/models', async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, systemPrompt, models } = body;

    if (!prompt || !models || models.length === 0) {
      return c.json({
        error: 'Missing required fields: prompt, models'
      }, 400);
    }

    const orchestrator = new MasterOrchestrator(c.env);
    const result = await orchestrator.testModels({
      prompt,
      systemPrompt: systemPrompt || '你是一个游戏角色，请用该角色的口吻回答。',
      models
    });

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/worldviews/:id - Get worldview details
 */
api.get('/worldviews/:id', async (c) => {
  try {
    const worldviewId = parseInt(c.req.param('id'));
    const result = await c.env.DB.prepare(
      'SELECT w.*, p.name as project_name, p.game_type, p.theme FROM worldviews w LEFT JOIN projects p ON w.project_id = p.id WHERE w.id = ?'
    ).bind(worldviewId).first();

    if (!result) {
      return c.json({ error: 'Worldview not found' }, 404);
    }

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/characters/:id - Get character details
 */
api.get('/characters/:id', async (c) => {
  try {
    const characterId = parseInt(c.req.param('id'));
    const result = await c.env.DB.prepare(
      'SELECT * FROM characters WHERE id = ?'
    ).bind(characterId).first();

    if (!result) {
      return c.json({ error: 'Character not found' }, 404);
    }

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/health - Health check
 */
api.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'multi-agent-game-generator' });
});

/**
 * Helper function to generate markdown export
 */
function generateMarkdown(projectData: any): string {
  const { project, worldviews, storylines, characters, dialogues } = projectData;
  
  let md = `# ${project.name}\n\n`;
  md += `**游戏类型**: ${project.game_type}\n`;
  md += `**主题**: ${project.theme}\n`;
  md += `**状态**: ${project.status}\n`;
  md += `**创建时间**: ${project.created_at}\n\n`;
  
  // Worldview
  if (worldviews.length > 0) {
    const wv = worldviews[0];
    md += `## 世界观\n\n`;
    md += `### ${wv.title}\n\n`;
    if (wv.history) md += `**历史**:\n${wv.history}\n\n`;
    if (wv.geography) md += `**地理**:\n${wv.geography}\n\n`;
    if (wv.culture) md += `**文化**:\n${wv.culture}\n\n`;
    if (wv.lore) md += `**传说**:\n${wv.lore}\n\n`;
  }
  
  // Storylines
  if (storylines.length > 0) {
    md += `## 剧情\n\n`;
    for (const sl of storylines) {
      md += `### ${sl.title}\n\n`;
      if (sl.summary) md += `**概要**: ${sl.summary}\n\n`;
      if (sl.acts) md += `**分幕**:\n${sl.acts}\n\n`;
      if (sl.conflicts) md += `**冲突**: ${sl.conflicts}\n\n`;
    }
  }
  
  // Characters
  if (characters.length > 0) {
    md += `## 角色\n\n`;
    for (const char of characters) {
      md += `### ${char.name} (${char.role})\n\n`;
      if (char.personality) md += `**性格**: ${char.personality}\n\n`;
      if (char.background) md += `**背景**: ${char.background}\n\n`;
      if (char.appearance) md += `**外貌**: ${char.appearance}\n\n`;
      if (char.motivations) md += `**动机**: ${char.motivations}\n\n`;
      if (char.relationships) md += `**关系**: ${char.relationships}\n\n`;
    }
  }
  
  // Dialogues
  if (dialogues.length > 0) {
    md += `## 对话示例\n\n`;
    for (const dlg of dialogues) {
      md += `### 场景: ${dlg.scene_name}\n\n`;
      try {
        const content = JSON.parse(dlg.content);
        for (const line of content) {
          md += `> **[${line.emotion || 'neutral'}]** ${line.text}\n`;
          if (line.action) md += `> *(${line.action})*\n`;
          md += `>\n`;
        }
      } catch (e) {
        md += `${dlg.content}\n`;
      }
      md += `\n`;
    }
  }
  
  return md;
}

export default api;
