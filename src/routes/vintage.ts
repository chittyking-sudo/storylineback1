import { Hono } from 'hono'

const vintage = new Hono()

vintage.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>复古科技操作系统 - 游戏内容生成器 v3.0</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=VT323&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    
    <style>
        :root {
            --bg-cream: #fdf8e4;
            --bg-blue: #bde5e8;
            --window-blue: #0081ab;
            --border-dark: #222222;
            --font-mono: 'Courier Prime', monospace;
            --font-pixel: 'VT323', monospace;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            font-family: var(--font-mono);
            background-color: var(--bg-blue);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* --- Abstract Background Shapes --- */
        .bg-shape-1 {
            position: absolute;
            top: 0;
            left: 0;
            width: 60vw;
            height: 100vh;
            background-color: var(--bg-cream);
            border-right: 2px solid transparent;
            clip-path: ellipse(90% 100% at 0% 50%);
            z-index: -1;
        }

        .bg-shape-2 {
            position: absolute;
            bottom: -10%;
            right: -10%;
            width: 80vw;
            height: 80vh;
            background-color: var(--bg-cream);
            border-radius: 50%;
            z-index: -1;
        }

        /* --- Top Menu Bar --- */
        .top-bar {
            height: 40px;
            background: var(--bg-cream);
            border-bottom: 3px solid var(--border-dark);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10;
        }

        .menu-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .menu-icon {
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.1s;
        }

        .menu-icon:hover {
            transform: scale(1.1);
        }

        .menu-items {
            display: flex;
            gap: 15px;
        }

        .menu-item {
            cursor: pointer;
            transition: color 0.2s;
        }

        .menu-item:hover {
            color: var(--window-blue);
        }

        /* --- Main Layout Container --- */
        .desktop-area {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        /* --- Central Window --- */
        .main-window {
            width: 80vw;
            max-width: 900px;
            height: 75vh;
            max-height: 600px;
            background: var(--border-dark);
            border-radius: 12px;
            padding: 3px;
            box-shadow: 10px 10px 0px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            position: relative;
            right: 40px;
            transition: all 0.3s ease;
        }

        .window-header {
            background: var(--bg-cream);
            height: 35px;
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            padding: 0 15px;
            position: relative;
            border-bottom: 3px solid var(--border-dark);
        }

        .window-controls {
            display: flex;
            gap: 6px;
        }

        .control-dot {
            width: 12px;
            height: 12px;
            border: 2px solid var(--border-dark);
            border-radius: 50%;
            background: transparent;
            cursor: pointer;
            transition: background 0.2s;
        }

        .control-dot:hover {
            background: var(--border-dark);
        }

        .window-title {
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            letter-spacing: 1px;
        }

        .window-content {
            flex: 1;
            background: var(--window-blue);
            border-radius: 0 0 8px 8px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            color: var(--border-dark);
            position: relative;
            overflow-y: auto;
            padding: 30px 40px;
        }

        /* Retro Text Styling */
        .retro-h1 {
            font-family: var(--font-pixel);
            font-size: 72px;
            margin: 0 0 10px 0;
            letter-spacing: 2px;
            line-height: 1;
            text-transform: uppercase;
        }

        .retro-subtitle {
            font-family: var(--font-mono);
            font-size: 18px;
            margin-bottom: 30px;
            font-weight: bold;
        }

        /* --- Form Styles --- */
        .content-section {
            width: 100%;
            margin-top: 20px;
        }

        .form-container {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid var(--border-dark);
            border-radius: 8px;
            padding: 20px;
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

        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 10px;
            border: 2px solid var(--border-dark);
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 14px;
            background: var(--bg-cream);
        }

        .form-textarea {
            min-height: 100px;
            resize: vertical;
        }

        .btn {
            padding: 12px 24px;
            border: 2px solid var(--border-dark);
            border-radius: 6px;
            font-family: var(--font-mono);
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 4px 4px 0px var(--border-dark);
        }

        .btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px var(--border-dark);
        }

        .btn-primary {
            background: var(--bg-cream);
            color: var(--border-dark);
        }

        .btn-primary:hover {
            background: var(--border-dark);
            color: var(--bg-cream);
        }

        /* --- Projects List --- */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            width: 100%;
            margin-top: 20px;
        }

        .project-card {
            background: rgba(255, 255, 255, 0.3);
            border: 2px solid var(--border-dark);
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 3px 3px 0px var(--border-dark);
        }

        .project-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0px var(--border-dark);
        }

        .project-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 16px;
        }

        .project-desc {
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 10px;
        }

        .project-meta {
            font-size: 11px;
            opacity: 0.8;
        }

        /* --- Right Sidebar Icons --- */
        .icon-sidebar {
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .desktop-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: transform 0.1s;
        }

        .desktop-icon:active {
            transform: scale(0.95);
        }

        .icon-box {
            font-size: 42px;
            color: var(--border-dark);
            filter: drop-shadow(2px 2px 0px rgba(255,255,255,0.5));
        }

        .icon-label {
            font-size: 14px;
            font-weight: bold;
            color: var(--border-dark);
            text-align: center;
        }

        /* --- Loading & Messages --- */
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
            font-weight: bold;
        }

        .loading.active {
            display: block;
        }

        .message {
            padding: 15px;
            margin: 15px 0;
            border: 2px solid var(--border-dark);
            border-radius: 6px;
            font-weight: bold;
            display: none;
        }

        .message.success {
            background: rgba(44, 149, 96, 0.3);
            display: block;
        }

        .message.error {
            background: rgba(230, 98, 133, 0.3);
            display: block;
        }

        /* --- Views Switch --- */
        .view {
            display: none;
            width: 100%;
        }

        .view.active {
            display: block;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .main-window {
                width: 90vw;
                right: 0;
                height: 80vh;
            }

            .icon-sidebar {
                display: none;
            }

            .retro-h1 {
                font-size: 48px;
            }

            .retro-subtitle {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>

    <div class="bg-shape-1"></div>
    <div class="bg-shape-2"></div>

    <nav class="top-bar">
        <div class="menu-left">
            <i class="fa-solid fa-bars menu-icon" onclick="toggleMenu()"></i> 
            <div class="menu-items">
                <span class="menu-item" onclick="showView('home')">主页</span>
                <span class="menu-item" onclick="showView('create')">创建</span>
                <span class="menu-item" onclick="showView('projects')">项目</span>
                <span class="menu-item" onclick="window.location.href='/retro'">经典版</span>
                <span class="menu-item" onclick="window.location.href='/'">v2版</span>
            </div>
        </div>
        <div class="menu-right" id="current-time">
            Loading...
        </div>
    </nav>

    <div class="desktop-area">
        
        <div class="main-window">
            <div class="window-header">
                <div class="window-controls">
                    <div class="control-dot" onclick="alert('关闭功能')"></div>
                    <div class="control-dot" onclick="alert('最小化功能')"></div>
                </div>
                <div class="window-title">游戏内容生成器 • v3.0 复古科技版</div>
            </div>
            <div class="window-content">
                
                <!-- Home View -->
                <div id="home-view" class="view active">
                    <h1 class="retro-h1">游戏内容</h1>
                    <h1 class="retro-h1" style="margin-top: -20px;">生成器</h1>
                    <div class="retro-subtitle">经典计算美学 • 现代创作力量</div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <button class="btn btn-primary" onclick="showView('create')">
                            <i class="fas fa-magic"></i> 开始创作
                        </button>
                    </div>

                    <div style="margin-top: 40px; font-size: 14px; line-height: 1.8; max-width: 600px;">
                        <p><strong>✨ 基于 AI 技术的游戏内容生成工具</strong></p>
                        <p>• 生成游戏剧情、任务、对话、世界观设定</p>
                        <p>• 支持多种游戏类型和风格</p>
                        <p>• 快速迭代，激发创意灵感</p>
                        <p>• 所有内容本地存储，完全免费</p>
                    </div>
                </div>

                <!-- Create View -->
                <div id="create-view" class="view">
                    <h2 style="margin-top: 0; font-family: var(--font-pixel); font-size: 36px;">创建新项目</h2>
                    
                    <div class="form-container">
                        <form id="create-form">
                            <div class="form-group">
                                <label class="form-label">项目名称 *</label>
                                <input type="text" class="form-input" id="project-name" placeholder="例如：魔法学院大冒险" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">游戏类型 *</label>
                                <select class="form-select" id="game-type" required>
                                    <option value="">选择类型</option>
                                    <option value="rpg">角色扮演 (RPG)</option>
                                    <option value="adventure">冒险解谜</option>
                                    <option value="action">动作游戏</option>
                                    <option value="strategy">策略游戏</option>
                                    <option value="simulation">模拟经营</option>
                                    <option value="horror">恐怖惊悚</option>
                                    <option value="sci-fi">科幻太空</option>
                                    <option value="fantasy">奇幻魔法</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">生成内容类型 *</label>
                                <select class="form-select" id="content-type" required>
                                    <option value="">选择内容</option>
                                    <option value="story">主线剧情</option>
                                    <option value="quest">支线任务</option>
                                    <option value="character">角色设定</option>
                                    <option value="dialogue">对话脚本</option>
                                    <option value="worldbuilding">世界观设定</option>
                                    <option value="item">道具装备</option>
                                    <option value="location">场景地点</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">详细描述（可选）</label>
                                <textarea class="form-textarea" id="description" placeholder="描述您的创意和需求，例如：想要一个关于时间旅行的魔法学院故事..."></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">AI 模型选择 *</label>
                                <select class="form-select" id="ai-model" required>
                                    <option value="gemini">Google Gemini 2.0 Flash (推荐)</option>
                                    <option value="gpt4o">OpenAI GPT-4o</option>
                                    <option value="claude">Anthropic Claude</option>
                                </select>
                            </div>

                            <div id="message-box" class="message"></div>
                            <div id="loading-box" class="loading">
                                <i class="fas fa-spinner fa-spin"></i> AI 正在生成内容，请稍候...
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%;">
                                <i class="fas fa-magic"></i> 生成内容
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Projects View -->
                <div id="projects-view" class="view">
                    <h2 style="margin-top: 0; font-family: var(--font-pixel); font-size: 36px;">我的项目</h2>
                    
                    <div id="projects-list" class="projects-grid">
                        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                            <i class="fas fa-folder-open" style="font-size: 48px; opacity: 0.3;"></i>
                            <p style="margin-top: 20px; opacity: 0.6;">暂无项目，点击"创建"开始生成内容</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <aside class="icon-sidebar">
            <div class="desktop-icon" onclick="showView('home')">
                <i class="fa-solid fa-house icon-box"></i>
                <span class="icon-label">主页</span>
            </div>

            <div class="desktop-icon" onclick="showView('create')">
                <i class="fa-solid fa-wand-magic-sparkles icon-box"></i>
                <span class="icon-label">创建</span>
            </div>

            <div class="desktop-icon" onclick="showView('projects')">
                <i class="fa-regular fa-folder-open icon-box"></i>
                <span class="icon-label">项目</span>
            </div>

            <div class="desktop-icon" onclick="window.open('https://github.com/chittyking-sudo/storylineback1', '_blank')">
                <i class="fa-brands fa-github icon-box"></i>
                <span class="icon-label">GitHub</span>
            </div>
        </aside>

    </div>

    <script>
        // Update time
        function updateTime() {
            const now = new Date();
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            document.getElementById('current-time').textContent = 
                now.toLocaleDateString('zh-CN', options);
        }
        updateTime();
        setInterval(updateTime, 60000);

        // View switching
        function showView(viewName) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewName + '-view').classList.add('active');
            
            if (viewName === 'projects') {
                loadProjects();
            }
        }

        // Load projects from API
        async function loadProjects() {
            try {
                const response = await axios.get('/api/projects');
                const projects = response.data;
                
                const container = document.getElementById('projects-list');
                
                if (projects.length === 0) {
                    container.innerHTML = \`
                        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                            <i class="fas fa-folder-open" style="font-size: 48px; opacity: 0.3;"></i>
                            <p style="margin-top: 20px; opacity: 0.6;">暂无项目，点击"创建"开始生成内容</p>
                        </div>
                    \`;
                    return;
                }
                
                container.innerHTML = projects.map(project => \`
                    <div class="project-card" onclick="viewProject(\${project.id})">
                        <div class="project-title">\${project.name}</div>
                        <div class="project-desc">\${project.game_type} • \${project.content_type}</div>
                        <div class="project-meta">
                            <i class="fas fa-calendar"></i> \${new Date(project.created_at).toLocaleDateString('zh-CN')}
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('加载项目失败:', error);
                showMessage('加载项目失败', 'error');
            }
        }

        // View project details
        function viewProject(id) {
            window.location.href = '/retro/games/' + id;
        }

        // Form submission
        document.getElementById('create-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('project-name').value,
                game_type: document.getElementById('game-type').value,
                content_type: document.getElementById('content-type').value,
                description: document.getElementById('description').value,
                ai_model: document.getElementById('ai-model').value
            };
            
            // Show loading
            document.getElementById('loading-box').classList.add('active');
            document.getElementById('message-box').classList.remove('success', 'error');
            document.getElementById('message-box').style.display = 'none';
            
            try {
                const response = await axios.post('/api/generate', formData);
                
                // Hide loading
                document.getElementById('loading-box').classList.remove('active');
                
                if (response.data.success) {
                    showMessage('内容生成成功！正在跳转...', 'success');
                    setTimeout(() => {
                        window.location.href = '/retro/games/' + response.data.project.id;
                    }, 1500);
                } else {
                    showMessage('生成失败: ' + (response.data.error || '未知错误'), 'error');
                }
                
            } catch (error) {
                document.getElementById('loading-box').classList.remove('active');
                showMessage('生成失败: ' + (error.response?.data?.error || error.message), 'error');
            }
        });

        // Show message
        function showMessage(text, type) {
            const msgBox = document.getElementById('message-box');
            msgBox.textContent = text;
            msgBox.className = 'message ' + type;
        }

        // Menu toggle (for mobile)
        function toggleMenu() {
            const menuItems = document.querySelector('.menu-items');
            if (window.innerWidth <= 768) {
                alert('移动端菜单功能：可以在这里实现下拉菜单');
            }
        }
    </script>

</body>
</html>
  `)
})

export default vintage
