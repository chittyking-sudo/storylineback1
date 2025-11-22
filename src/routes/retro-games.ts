import { Hono } from 'hono';
import type { Env } from '../types';

const retroGames = new Hono<{ Bindings: Env }>();

// Get recent projects with retro styling
retroGames.get('/projects', async (c) => {
  try {
    const db = c.env.DB;
    const projects = await db
      .prepare('SELECT * FROM projects ORDER BY created_at DESC LIMIT 10')
      .all();

    return c.html(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>游戏项目列表 - Retro Style</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <style>
              @font-face {
                  font-family: 'Pixeloid Sans';
                  src: url('https://www.genspark.ai/api/files/s/OSp0E2Uz') format('woff2');
                  font-weight: bold;
                  font-style: normal;
                  font-display: swap;
              }

              @font-face {
                  font-family: 'FZG CN';
                  src: url('https://www.genspark.ai/api/files/s/3xl03SBJ') format('opentype'),
                       url('https://www.genspark.ai/api/files/s/0aHham4g') format('truetype');
                  font-weight: normal;
                  font-style: normal;
                  font-display: swap;
              }

              :root {
                  --bg-beige: #f0d7b7;
                  --retro-pink: #e66285;
                  --retro-green: #2c9560;
                  --retro-blue: #5c7cfa;
                  --border-color: #000100;
              }
              body {
                  margin: 0;
                  padding: 20px;
                  background: #222;
                  font-family: 'FZG CN', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
              }
              .container {
                  max-width: 1200px;
                  margin: 0 auto;
                  background: var(--bg-beige);
                  border: 3px solid black;
                  box-shadow: 10px 10px 0 black;
                  padding: 30px;
              }
              h1 {
                  font-family: 'Pixeloid Sans', 'Arial Black', sans-serif;
                  font-size: 48px;
                  color: var(--retro-pink);
                  text-shadow: 3px 3px 0 black;
                  -webkit-text-stroke: 2px black;
                  text-align: center;
                  margin-bottom: 30px;
              }
              .project-card {
                  background: white;
                  border: 2px solid black;
                  box-shadow: 5px 5px 0 black;
                  padding: 20px;
                  margin-bottom: 20px;
                  transition: transform 0.2s;
              }
              .project-card:hover {
                  transform: translate(-2px, -2px);
                  box-shadow: 7px 7px 0 black;
              }
              .project-header {
                  background: var(--retro-green);
                  border: 2px solid black;
                  padding: 10px;
                  font-weight: bold;
                  font-size: 20px;
                  margin-bottom: 15px;
              }
              .project-info {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 10px;
                  margin-bottom: 15px;
              }
              .info-item {
                  background: var(--bg-beige);
                  border: 1px solid black;
                  padding: 8px;
                  font-size: 14px;
              }
              .info-label {
                  font-weight: bold;
                  color: var(--retro-blue);
              }
              .btn {
                  display: inline-block;
                  background: var(--retro-pink);
                  border: 2px solid black;
                  padding: 10px 20px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                  margin-right: 10px;
                  box-shadow: 3px 3px 0 black;
                  transition: transform 0.1s;
              }
              .btn:active {
                  transform: translate(2px, 2px);
                  box-shadow: 1px 1px 0 black;
              }
              .btn-green {
                  background: var(--retro-green);
              }
              .back-btn {
                  position: fixed;
                  top: 20px;
                  left: 20px;
                  background: var(--retro-pink);
                  border: 2px solid black;
                  padding: 10px 15px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                  box-shadow: 3px 3px 0 black;
                  z-index: 1000;
              }
          </style>
      </head>
      <body>
          <a href="/retro" class="back-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回主页
          </a>
          
          <div class="container">
              <h1>游戏项目列表</h1>
              ${
                projects.results.length > 0
                  ? projects.results
                      .map(
                        (p: any) => `
                  <div class="project-card">
                      <div class="project-header">
                          <i class="fa-solid fa-gamepad"></i> ${p.name}
                      </div>
                      <div class="project-info">
                          <div class="info-item">
                              <span class="info-label">ID:</span> ${p.id}
                          </div>
                          <div class="info-item">
                              <span class="info-label">状态:</span> ${p.status}
                          </div>
                          <div class="info-item">
                              <span class="info-label">创建时间:</span> ${new Date(
                                p.created_at
                              ).toLocaleString('zh-CN')}
                          </div>
                          <div class="info-item">
                              <span class="info-label">更新时间:</span> ${new Date(
                                p.updated_at
                              ).toLocaleString('zh-CN')}
                          </div>
                      </div>
                      <a href="/retro/games/project/${p.id}" class="btn">
                          <i class="fa-solid fa-eye"></i> 查看详情
                      </a>
                      <a href="/" class="btn btn-green" target="_blank">
                          <i class="fa-solid fa-edit"></i> 编辑项目
                      </a>
                  </div>
              `
                      )
                      .join('')
                  : '<p style="text-align: center; font-size: 18px; padding: 40px;">暂无项目，请先创建一个游戏项目！</p>'
              }
              
              <div style="text-align: center; margin-top: 30px;">
                  <a href="/" class="btn" style="font-size: 18px;">
                      <i class="fa-solid fa-plus"></i> 创建新项目
                  </a>
              </div>
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// Get project details
retroGames.get('/project/:id', async (c) => {
  try {
    const projectId = parseInt(c.req.param('id'));
    const db = c.env.DB;

    const project = await db
      .prepare('SELECT * FROM projects WHERE id = ?')
      .bind(projectId)
      .first();

    if (!project) {
      return c.html('<h1>项目不存在</h1>');
    }

    const worldview = await db
      .prepare('SELECT * FROM worldviews WHERE project_id = ?')
      .bind(projectId)
      .first();

    const characters = await db
      .prepare('SELECT * FROM characters WHERE project_id = ?')
      .bind(projectId)
      .all();

    return c.html(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${project.name} - 项目详情</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <style>
              @font-face {
                  font-family: 'Pixeloid Sans';
                  src: url('https://www.genspark.ai/api/files/s/OSp0E2Uz') format('woff2');
                  font-weight: bold;
                  font-style: normal;
                  font-display: swap;
              }

              @font-face {
                  font-family: 'FZG CN';
                  src: url('https://www.genspark.ai/api/files/s/3xl03SBJ') format('opentype'),
                       url('https://www.genspark.ai/api/files/s/0aHham4g') format('truetype');
                  font-weight: normal;
                  font-style: normal;
                  font-display: swap;
              }

              :root {
                  --bg-beige: #f0d7b7;
                  --retro-pink: #e66285;
                  --retro-green: #2c9560;
                  --retro-blue: #5c7cfa;
                  --border-color: #000100;
              }
              body {
                  margin: 0;
                  padding: 20px;
                  background: #222;
                  font-family: 'FZG CN', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
              }
              .container {
                  max-width: 1400px;
                  margin: 0 auto;
                  background: var(--bg-beige);
                  border: 3px solid black;
                  box-shadow: 10px 10px 0 black;
                  padding: 30px;
              }
              h1 {
                  font-family: 'Pixeloid Sans', 'Arial Black', sans-serif;
                  font-size: 48px;
                  color: var(--retro-pink);
                  text-shadow: 3px 3px 0 black;
                  -webkit-text-stroke: 2px black;
                  text-align: center;
                  margin-bottom: 30px;
              }
              h2 {
                  font-family: 'Pixeloid Sans', 'Arial Black', sans-serif;
                  font-size: 32px;
                  color: var(--retro-green);
                  text-shadow: 2px 2px 0 black;
                  -webkit-text-stroke: 1px black;
                  margin-top: 30px;
                  margin-bottom: 15px;
              }
              .section {
                  background: white;
                  border: 2px solid black;
                  box-shadow: 5px 5px 0 black;
                  padding: 20px;
                  margin-bottom: 25px;
              }
              .section-header {
                  background: var(--retro-blue);
                  border: 2px solid black;
                  padding: 10px;
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 15px;
              }
              .content-box {
                  background: var(--bg-beige);
                  border: 1px solid black;
                  padding: 15px;
                  margin-bottom: 10px;
                  line-height: 1.6;
              }
              .character-card {
                  background: white;
                  border: 2px solid black;
                  box-shadow: 3px 3px 0 black;
                  padding: 15px;
                  margin-bottom: 15px;
              }
              .character-header {
                  background: var(--retro-pink);
                  border: 1px solid black;
                  padding: 8px;
                  font-weight: bold;
                  font-size: 16px;
                  margin-bottom: 10px;
              }
              .back-btn {
                  position: fixed;
                  top: 20px;
                  left: 20px;
                  background: var(--retro-pink);
                  border: 2px solid black;
                  padding: 10px 15px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                  box-shadow: 3px 3px 0 black;
                  z-index: 1000;
              }
          </style>
      </head>
      <body>
          <a href="/retro/games/projects" class="back-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回列表
          </a>
          
          <div class="container">
              <h1><i class="fa-solid fa-gamepad"></i> ${project.name}</h1>
              
              ${
                worldview
                  ? `
              <h2>世界观设定</h2>
              <div class="section">
                  <div class="section-header">
                      <i class="fa-solid fa-globe"></i> 世界观详情
                  </div>
                  <div class="content-box">
                      <strong>名称:</strong> ${worldview.name || '未命名'}<br>
                      <strong>游戏类型:</strong> ${worldview.game_type || '未指定'}<br>
                      <strong>主题:</strong> ${worldview.theme || '未指定'}<br>
                      <strong>模型:</strong> ${worldview.model || '未指定'}
                  </div>
                  ${
                    worldview.history
                      ? `
                  <div class="content-box">
                      <strong>历史背景:</strong><br>
                      ${worldview.history}
                  </div>
                  `
                      : ''
                  }
                  ${
                    worldview.geography
                      ? `
                  <div class="content-box">
                      <strong>地理环境:</strong><br>
                      ${worldview.geography}
                  </div>
                  `
                      : ''
                  }
                  ${
                    worldview.culture
                      ? `
                  <div class="content-box">
                      <strong>文化体系:</strong><br>
                      ${worldview.culture}
                  </div>
                  `
                      : ''
                  }
                  ${
                    worldview.lore
                      ? `
                  <div class="content-box">
                      <strong>设定资料:</strong><br>
                      ${worldview.lore}
                  </div>
                  `
                      : ''
                  }
              </div>
              `
                  : '<p style="text-align: center; padding: 20px;">暂无世界观数据</p>'
              }
              
              ${
                characters.results.length > 0
                  ? `
              <h2>角色列表</h2>
              <div class="section">
                  ${characters.results
                    .map(
                      (char: any) => `
                  <div class="character-card">
                      <div class="character-header">
                          <i class="fa-solid fa-user"></i> ${char.name}
                      </div>
                      ${
                        char.description
                          ? `<div class="content-box"><strong>描述:</strong> ${char.description}</div>`
                          : ''
                      }
                      ${
                        char.background
                          ? `<div class="content-box"><strong>背景:</strong> ${char.background}</div>`
                          : ''
                      }
                      ${
                        char.personality
                          ? `<div class="content-box"><strong>性格:</strong> ${char.personality}</div>`
                          : ''
                      }
                      ${
                        char.abilities
                          ? `<div class="content-box"><strong>能力:</strong> ${char.abilities}</div>`
                          : ''
                      }
                  </div>
                  `
                    )
                    .join('')}
              </div>
              `
                  : ''
              }
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default retroGames;
