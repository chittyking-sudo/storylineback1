import { Hono } from 'hono';
import type { Env } from '../types';

const main = new Hono<{ Bindings: Env }>();

main.get('/', async (c) => {
  try {
    const db = c.env.DB;
    const projects = await db
      .prepare('SELECT * FROM projects ORDER BY created_at DESC LIMIT 20')
      .all();

    return c.html(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>游戏内容生成器 - Retro Edition</title>
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
            --retro-black: #000100;
            --border-color: #000100;
            --shadow: 4px 4px 0px #000100;
            --font-main: 'Pixeloid Sans', 'Arial Black', 'Impact', sans-serif;
            --font-ui: 'FZG CN', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: #222;
            font-family: var(--font-ui);
            padding: 20px;
            min-height: 100vh;
        }

        .browser-window {
            max-width: 1600px;
            margin: 0 auto;
            background: var(--bg-beige);
            border: 3px solid var(--border-color);
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        /* Window Header */
        .window-header {
            background: #e0e0e0;
            border-bottom: 3px solid var(--border-color);
            padding: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .window-title {
            font-weight: bold;
            font-size: 12px;
            color: #555;
            margin-left: 10px;
        }

        .nav-controls i {
            font-size: 20px;
            margin-right: 10px;
            cursor: pointer;
            color: #555;
        }

        .address-bar {
            flex-grow: 1;
            background: white;
            border: 2px solid var(--border-color);
            padding: 5px 10px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }

        .window-controls {
            display: flex;
            gap: 5px;
        }
        
        .win-btn {
            width: 15px; 
            height: 15px; 
            border: 2px solid black; 
            background: #ccc;
            cursor: pointer;
        }

        /* Main Layout */
        .main-container {
            display: flex;
            min-height: 800px;
        }

        /* Sidebar */
        .sidebar {
            width: 260px;
            background: var(--bg-beige);
            border-right: 3px solid var(--border-color);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .sidebar-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            border: 2px solid var(--border-color);
            box-shadow: 3px 3px 0px var(--border-color);
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.1s;
            text-transform: capitalize;
            background: var(--retro-green);
        }

        .sidebar-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px var(--border-color);
        }

        .sidebar-btn.active {
            background: var(--retro-pink);
        }

        .btn-pink { background: var(--retro-pink); }

        .spacer {
            height: 20px;
        }

        .footer-socials {
            margin-top: auto;
        }
        
        .social-row {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
        }

        .social-icon {
            width: 30px;
            height: 30px;
            background: var(--retro-pink);
            border: 2px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
        }

        .copyright {
            font-size: 12px;
            font-weight: bold;
        }

        /* Content Area */
        .content-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            background: white;
        }

        /* Hero Section */
        .hero {
            background: var(--retro-green);
            background-image: 
                linear-gradient(45deg, var(--retro-pink) 25%, transparent 25%), 
                linear-gradient(-45deg, var(--retro-pink) 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, var(--retro-pink) 75%), 
                linear-gradient(-45deg, transparent 75%, var(--retro-pink) 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            position: relative;
            padding: 30px;
            text-align: center;
            border-bottom: 3px solid var(--border-color);
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--retro-green);
            opacity: 0.85;
            z-index: 0;
        }

        .hero-title {
            font-family: var(--font-main);
            font-size: 48px;
            line-height: 1.1;
            color: var(--retro-pink);
            text-shadow: 3px 3px 0px var(--retro-black);
            -webkit-text-stroke: 2px var(--retro-black);
            margin: 0;
            position: relative;
            z-index: 1;
        }

        .hero-subtitle {
            font-family: var(--font-main);
            font-size: 38px;
            color: var(--bg-beige);
            text-shadow: 2px 2px 0px var(--retro-black);
            -webkit-text-stroke: 1px var(--retro-black);
            position: relative;
            z-index: 1;
        }

        /* Two Column Layout */
        .two-column {
            display: flex;
            gap: 0;
            border-bottom: 3px solid var(--border-color);
        }

        /* Create Form Section */
        .create-section {
            flex: 1;
            padding: 30px;
            background: var(--bg-beige);
            border-right: 3px solid var(--border-color);
        }

        .section-header {
            font-family: var(--font-main);
            font-size: 28px;
            color: var(--retro-pink);
            text-shadow: 2px 2px 0px var(--retro-black);
            -webkit-text-stroke: 1px var(--retro-black);
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .form-input,
        .form-select,
        .form-textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid var(--retro-black);
            background: white;
            font-family: var(--font-ui);
            font-size: 14px;
        }

        .form-textarea {
            min-height: 80px;
            resize: vertical;
        }

        .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 5px;
            background: white;
            border: 2px solid var(--retro-black);
            padding: 8px 12px;
            cursor: pointer;
            font-size: 13px;
        }

        .checkbox-label input {
            cursor: pointer;
        }

        .btn-primary {
            width: 100%;
            padding: 15px;
            background: var(--retro-pink);
            border: 3px solid var(--retro-black);
            box-shadow: 4px 4px 0px var(--retro-black);
            font-family: var(--font-main);
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.1s;
        }

        .btn-primary:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px var(--retro-black);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Agent Info Section */
        .agent-section {
            flex: 1;
            padding: 30px;
            background: white;
        }

        .agent-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .agent-card {
            border: 2px solid var(--retro-black);
            background: var(--bg-beige);
            padding: 15px;
            box-shadow: 3px 3px 0px var(--retro-black);
        }

        .agent-card-header {
            background: var(--retro-green);
            border: 2px solid var(--retro-black);
            padding: 8px;
            font-weight: bold;
            margin: -15px -15px 10px -15px;
            font-size: 14px;
        }

        .agent-card.pink .agent-card-header {
            background: var(--retro-pink);
        }

        .agent-card p {
            font-size: 13px;
            line-height: 1.5;
        }

        /* Projects List Section */
        .projects-section {
            padding: 30px;
            background: white;
        }

        .project-item {
            border: 2px solid var(--retro-black);
            background: var(--bg-beige);
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 3px 3px 0px var(--retro-black);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .project-info h3 {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }

        .project-info p {
            font-size: 12px;
            color: #555;
        }

        .project-actions {
            display: flex;
            gap: 10px;
        }

        .btn-small {
            padding: 8px 15px;
            border: 2px solid var(--retro-black);
            background: var(--retro-green);
            font-weight: bold;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 2px 2px 0px var(--retro-black);
            text-decoration: none;
            color: black;
            display: inline-block;
        }

        .btn-small:active {
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 0px var(--retro-black);
        }

        .btn-small.pink {
            background: var(--retro-pink);
        }

        /* Loading Overlay */
        .loading-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }

        .loading-overlay.active {
            display: flex;
        }

        .loading-box {
            background: var(--bg-beige);
            border: 3px solid var(--retro-black);
            box-shadow: 5px 5px 0px var(--retro-black);
            padding: 40px;
            text-align: center;
            max-width: 500px;
        }

        .loading-title {
            font-family: var(--font-main);
            font-size: 24px;
            color: var(--retro-pink);
            margin-bottom: 20px;
        }

        .loading-status {
            font-size: 14px;
            margin-bottom: 15px;
        }

        .spinner {
            border: 4px solid var(--bg-beige);
            border-top: 4px solid var(--retro-pink);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .empty-state i {
            font-size: 64px;
            color: var(--retro-pink);
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <div class="browser-window">
        <div class="window-header">
            <span class="window-title">游戏内容生成器 - RETRO EDITION v2.3</span>
            <div class="nav-controls" style="margin-left: auto; margin-right: 10px;">
                <i class="fa-solid fa-arrow-left"></i>
                <i class="fa-solid fa-arrow-right"></i>
                <i class="fa-solid fa-rotate-right" onclick="location.reload()"></i>
            </div>
            <div class="address-bar">http://game-generator.retro/home</div>
            <div class="window-controls">
                <div class="win-btn"></div>
                <div class="win-btn"></div>
            </div>
        </div>

        <div class="main-container">
            <div class="sidebar">
                <div class="sidebar-btn active" onclick="showSection('create')">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> 创建项目
                </div>
                <div class="sidebar-btn" onclick="showSection('projects')">
                    <i class="fa-solid fa-folder-open"></i> 项目列表
                </div>
                <div class="sidebar-btn" onclick="showSection('agents')">
                    <i class="fa-solid fa-robot"></i> Agent 信息
                </div>
                <div class="sidebar-btn" onclick="window.open('/api/health', '_blank')">
                    <i class="fa-solid fa-heart-pulse"></i> 系统状态
                </div>

                <div class="spacer"></div>

                <div class="sidebar-btn btn-pink" onclick="showHelp()">
                    <i class="fa-solid fa-question-circle"></i> 使用帮助
                </div>

                <div class="footer-socials">
                    <div class="social-row">
                        <div class="social-icon"><i class="fa-brands fa-github"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-code"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-gamepad"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-database"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-robot"></i></div>
                    </div>
                    <div class="copyright">© 2025 Game Generator Retro</div>
                </div>
            </div>

            <div class="content-area">
                <div class="hero">
                    <h1 class="hero-title">AI 游戏内容</h1>
                    <h2 class="hero-subtitle">自动生成器</h2>
                </div>

                <!-- Create Section -->
                <div id="section-create" class="two-column">
                    <div class="create-section">
                        <h2 class="section-header">创建新项目</h2>
                        
                        <form id="createForm" onsubmit="handleSubmit(event)">
                            <div class="form-group">
                                <label class="form-label">项目名称</label>
                                <input type="text" class="form-input" id="projectName" required placeholder="例如：魔法大陆冒险">
                            </div>

                            <div class="form-group">
                                <label class="form-label">世界观风格</label>
                                <select class="form-select" id="worldviewStyle" required onchange="updateGameTypeOptions()">
                                    <option value="">选择世界观风格</option>
                                    <optgroup label="电影剧本">
                                        <option value="电影剧本-喜剧">喜剧</option>
                                        <option value="电影剧本-解谜">解谜</option>
                                        <option value="电影剧本-悬疑">悬疑</option>
                                        <option value="电影剧本-言情">言情</option>
                                    </optgroup>
                                    <optgroup label="游戏世界">
                                        <option value="游戏世界-魔幻游戏">魔幻游戏</option>
                                        <option value="游戏世界-乙游">乙女游戏</option>
                                    </optgroup>
                                    <option value="自定义">自定义</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">游戏类型</label>
                                <select class="form-select" id="gameType" required>
                                    <option value="">请先选择世界观风格</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">主题描述</label>
                                <textarea class="form-textarea" id="theme" required placeholder="描述游戏的核心主题和故事背景..."></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">角色数量</label>
                                <input type="number" class="form-input" id="characterCount" value="5" min="1" max="20">
                            </div>

                            <div class="form-group">
                                <label class="form-label">选择模型</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="models" value="openai:gpt-4o-mini" checked>
                                        GPT-4o-mini
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="models" value="google:gemini-2.0-flash-exp">
                                        Gemini
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="models" value="openai:gpt-4o">
                                        GPT-4o
                                    </label>
                                </div>
                            </div>

                            <button type="submit" class="btn-primary" id="submitBtn">
                                <i class="fa-solid fa-rocket"></i> 开始生成
                            </button>
                        </form>
                    </div>

                    <div class="agent-section">
                        <h2 class="section-header">AI Agents</h2>
                        <div class="agent-grid">
                            <div class="agent-card">
                                <div class="agent-card-header">
                                    <i class="fa-solid fa-globe"></i> 世界观设计
                                </div>
                                <p>构建游戏世界的历史、地理、文化体系和传说故事</p>
                            </div>

                            <div class="agent-card pink">
                                <div class="agent-card-header">
                                    <i class="fa-solid fa-book-open"></i> 剧情架构
                                </div>
                                <p>设计主线支线剧情、冲突点和角色成长弧线</p>
                            </div>

                            <div class="agent-card pink">
                                <div class="agent-card-header">
                                    <i class="fa-solid fa-users"></i> 角色创建
                                </div>
                                <p>生成立体角色、性格背景和关系网络</p>
                            </div>

                            <div class="agent-card">
                                <div class="agent-card-header">
                                    <i class="fa-solid fa-comments"></i> 对话生成
                                </div>
                                <p>创作符合角色性格的生动对话场景</p>
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; border: 2px solid var(--retro-black); background: var(--bg-beige);">
                            <p style="font-size: 13px; line-height: 1.6;">
                                <strong>✨ 特色功能：</strong><br>
                                • 多模型对比生成<br>
                                • 分阶段内容扩展<br>
                                • 智能一致性检查<br>
                                • 多格式内容导出
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Projects List Section -->
                <div id="section-projects" class="projects-section" style="display: none;">
                    <h2 class="section-header">项目列表</h2>
                    <div id="projectsList">
                        ${
                          projects.results.length > 0
                            ? projects.results
                                .map(
                                  (p: any) => `
                        <div class="project-item">
                            <div class="project-info">
                                <h3><i class="fa-solid fa-gamepad"></i> ${p.name}</h3>
                                <p>状态: ${p.status} | 创建于: ${new Date(
                                    p.created_at
                                  ).toLocaleDateString('zh-CN')}</p>
                            </div>
                            <div class="project-actions">
                                <a href="/retro/games/project/${
                                  p.id
                                }" target="_blank" class="btn-small pink">
                                    <i class="fa-solid fa-eye"></i> 查看
                                </a>
                                <button class="btn-small" onclick="deleteProject(${
                                  p.id
                                })">
                                    <i class="fa-solid fa-trash"></i> 删除
                                </button>
                            </div>
                        </div>
                        `
                                )
                                .join('')
                            : '<div class="empty-state"><i class="fa-solid fa-folder-open"></i><h3>还没有项目</h3><p>点击左侧"创建项目"开始你的第一个项目！</p></div>'
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-box">
            <div class="loading-title">正在生成内容...</div>
            <div class="spinner"></div>
            <div class="loading-status" id="loadingStatus">初始化 AI Agents...</div>
        </div>
    </div>

    <script src="/static/app.js"></script>
    <script>
        function showSection(section) {
            // Update sidebar active state
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.closest('.sidebar-btn').classList.add('active');

            // Show/hide sections
            if (section === 'create') {
                document.getElementById('section-create').style.display = 'flex';
                document.getElementById('section-projects').style.display = 'none';
            } else if (section === 'projects') {
                document.getElementById('section-create').style.display = 'none';
                document.getElementById('section-projects').style.display = 'block';
                loadProjects();
            } else if (section === 'agents') {
                alert('Agent 详细信息功能开发中...');
            }
        }

        function showHelp() {
            alert('🎮 游戏内容生成器使用指南\\n\\n1. 填写项目信息\\n2. 选择世界观风格和游戏类型\\n3. 描述游戏主题\\n4. 选择 AI 模型\\n5. 点击开始生成\\n6. 等待 1-2 分钟\\n7. 在项目列表查看结果');
        }

        async function loadProjects() {
            try {
                const response = await fetch('/api/projects');
                const projects = await response.json();
                
                const container = document.getElementById('projectsList');
                if (projects.length === 0) {
                    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-folder-open"></i><h3>还没有项目</h3><p>点击左侧"创建项目"开始你的第一个项目！</p></div>';
                    return;
                }

                container.innerHTML = projects.map(p => \`
                    <div class="project-item">
                        <div class="project-info">
                            <h3><i class="fa-solid fa-gamepad"></i> \${p.name}</h3>
                            <p>状态: \${p.status} | 创建于: \${new Date(p.created_at).toLocaleDateString('zh-CN')}</p>
                        </div>
                        <div class="project-actions">
                            <a href="/retro/games/project/\${p.id}" target="_blank" class="btn-small pink">
                                <i class="fa-solid fa-eye"></i> 查看
                            </a>
                            <button class="btn-small" onclick="deleteProject(\${p.id})">
                                <i class="fa-solid fa-trash"></i> 删除
                            </button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        }

        async function deleteProject(id) {
            if (!confirm('确定要删除这个项目吗？')) return;
            
            try {
                // TODO: Implement delete API
                alert('删除功能开发中...');
            } catch (error) {
                alert('删除失败: ' + error.message);
            }
        }

        async function handleSubmit(event) {
            event.preventDefault();
            
            const projectName = document.getElementById('projectName').value;
            const gameType = document.getElementById('gameType').value;
            const theme = document.getElementById('theme').value;
            const characterCount = parseInt(document.getElementById('characterCount').value);
            
            const selectedModels = Array.from(document.querySelectorAll('input[name="models"]:checked'))
                .map(cb => cb.value);
            
            if (selectedModels.length === 0) {
                alert('请至少选择一个 AI 模型');
                return;
            }

            // Show loading
            document.getElementById('loadingOverlay').classList.add('active');
            document.getElementById('submitBtn').disabled = true;

            try {
                const response = await fetch('/api/generate/worldview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectName,
                        gameType,
                        theme,
                        models: selectedModels
                    })
                });

                if (!response.ok) throw new Error('生成失败');

                const result = await response.json();
                
                // Hide loading
                document.getElementById('loadingOverlay').classList.remove('active');
                document.getElementById('submitBtn').disabled = false;

                alert('✅ 项目创建成功！\\n\\n项目 ID: ' + result.projectId + '\\n\\n点击"项目列表"查看详情');
                
                // Switch to projects view
                showSection('projects');
                
                // Reset form
                document.getElementById('createForm').reset();
            } catch (error) {
                document.getElementById('loadingOverlay').classList.remove('active');
                document.getElementById('submitBtn').disabled = false;
                alert('❌ 生成失败: ' + error.message);
            }
        }

        // Initialize
        console.log('🎮 Game Generator Retro Edition v2.3 - Ready!');
    </script>

</body>
</html>
    `);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default main;
