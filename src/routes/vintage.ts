import { Hono } from 'hono';

const vintage = new Hono();

// v3.0 - Vintage Tech OS 版本，使用 v2.2 的完整操作界面
vintage.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>游戏内容生成器 - v3.0 Vintage Tech OS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
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
            --retro-dark-blue: #415bc4;
            --border-color: #000100;
            --shadow: 4px 4px 0px #000100;
            --font-main: 'Pixeloid Sans', 'Arial Black', 'Impact', sans-serif;
            --font-ui: 'FZG CN', 'Verdana', sans-serif;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 20px;
            background-color: #222;
            font-family: var(--font-ui);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Main Browser Window - 使用附件的尺寸 */
        .browser-window {
            width: 1200px;
            height: 800px;
            background: var(--bg-beige);
            border: 3px solid var(--border-color);
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            overflow: hidden;
        }

        /* Window Header / Address Bar */
        .window-header {
            background: #e0e0e0;
            border-bottom: 3px solid var(--border-color);
            padding: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nav-controls i {
            font-size: 20px;
            margin-right: 10px;
            cursor: pointer;
            color: #555;
            transition: color 0.2s;
        }

        .nav-controls i:hover {
            color: var(--retro-pink);
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
            transition: background 0.2s;
        }

        .win-btn:hover {
            background: var(--retro-pink);
        }

        /* Layout Container */
        .viewport {
            display: flex;
            flex: 1;
            overflow: hidden;
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
            position: relative;
            overflow-y: auto;
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
        }

        .sidebar-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px var(--border-color);
        }

        .btn-green { background: var(--retro-green); color: white; }
        .btn-pink { background: var(--retro-pink); color: white; }
        .btn-blue { background: var(--retro-blue); color: white; }

        .spacer {
            height: 20px;
        }

        .footer-socials {
            margin-top: auto;
            padding-top: 20px;
            border-top: 2px solid var(--border-color);
        }
        
        .social-row {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
            flex-wrap: wrap;
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
            transition: background 0.2s;
        }

        .social-icon:hover {
            background: var(--retro-green);
        }

        .copyright {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
        }

        /* Main Content Area */
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }

        /* Hero Section */
        .hero {
            background-color: var(--retro-dark-blue);
            background-image: 
                linear-gradient(45deg, var(--retro-pink) 25%, transparent 25%), 
                linear-gradient(-45deg, var(--retro-pink) 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, var(--retro-pink) 75%), 
                linear-gradient(-45deg, transparent 75%, var(--retro-pink) 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            
            position: relative;
            padding: 40px;
            text-align: center;
            border-bottom: 3px solid var(--border-color);
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--retro-dark-blue);
            opacity: 0.85; 
            z-index: -1;
        }

        .hero-title {
            font-family: var(--font-main);
            font-size: 72px;
            line-height: 0.9;
            color: var(--retro-pink);
            text-shadow: 4px 4px 0px #000;
            -webkit-text-stroke: 2px black;
            margin: 0;
            z-index: 2;
        }

        .hero-title.green {
            color: var(--retro-green);
        }

        .hero-subtitle-box {
            margin-top: 20px;
            background: var(--bg-beige);
            border: 2px solid black;
            padding: 10px 20px;
            box-shadow: 4px 4px 0px black;
            font-weight: bold;
            font-size: 18px;
            z-index: 2;
            max-width: 80%;
        }

        /* Form Section */
        .form-section {
            padding: 30px;
            background: white;
            flex: 1;
            overflow-y: auto;
        }

        .section-title {
            font-family: var(--font-main);
            font-size: 36px;
            color: var(--retro-pink);
            text-shadow: 2px 2px 0px var(--border-color);
            margin-bottom: 20px;
            text-align: center;
        }

        .form-container {
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg-beige);
            border: 3px solid var(--border-color);
            box-shadow: 6px 6px 0px var(--border-color);
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 16px;
            color: var(--border-color);
        }

        .form-label .required {
            color: var(--retro-pink);
        }

        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid var(--border-color);
            font-family: var(--font-ui);
            font-size: 14px;
            background: white;
            box-shadow: inset 2px 2px 0px rgba(0,0,0,0.1);
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--retro-pink);
            box-shadow: inset 2px 2px 0px rgba(230, 98, 133, 0.2);
        }

        .form-select {
            cursor: pointer;
            appearance: auto;
            -webkit-appearance: menulist;
            -moz-appearance: menulist;
            background-image: none;
            padding-right: 12px;
        }
        
        /* 确保 select 选项可见 */
        .form-select option {
            background: white;
            color: black;
            padding: 10px;
        }

        .form-textarea {
            min-height: 100px;
            resize: vertical;
        }

        .form-hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: var(--retro-green);
            color: white;
            border: 3px solid var(--border-color);
            box-shadow: 4px 4px 0px var(--border-color);
            font-family: var(--font-main);
            font-size: 24px;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.1s;
            margin-top: 10px;
        }

        .btn-submit:hover {
            background: var(--retro-pink);
        }

        .btn-submit:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px var(--border-color);
        }

        .btn-submit:disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.6;
        }

        /* Loading & Messages */
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
            font-weight: bold;
            background: var(--retro-blue);
            color: white;
            border: 2px solid var(--border-color);
            margin-bottom: 20px;
        }

        .loading.active {
            display: block;
        }

        .message {
            padding: 15px;
            margin-bottom: 20px;
            border: 2px solid var(--border-color);
            font-weight: bold;
            display: none;
        }

        .message.success {
            background: var(--retro-green);
            color: white;
            display: block;
        }

        .message.error {
            background: var(--retro-pink);
            color: white;
            display: block;
        }

        /* Views */
        .view {
            display: none;
        }

        .view.active {
            display: block;
        }

        /* Projects Grid */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .project-card {
            background: var(--bg-beige);
            border: 3px solid var(--border-color);
            box-shadow: 5px 5px 0px var(--border-color);
            padding: 20px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .project-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 7px 7px 0px var(--border-color);
        }

        .project-title {
            font-family: var(--font-main);
            font-size: 20px;
            color: var(--retro-pink);
            margin-bottom: 10px;
        }

        .project-desc {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .project-meta {
            font-size: 12px;
            color: #666;
            border-top: 2px solid var(--border-color);
            padding-top: 10px;
        }

        /* Responsive */
        @media (max-width: 1280px) {
            .browser-window {
                width: 95vw;
                height: 90vh;
            }
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
            }

            .browser-window {
                width: 100%;
                height: 100%;
            }

            .sidebar {
                display: none;
            }

            .hero-title {
                font-size: 48px;
            }

            .form-container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>

    <div class="browser-window">
        <div class="window-header">
            <div style="position:absolute; top:10px; left:10px; font-size:10px; font-weight:bold; color:#555;">游戏内容生成器 - v3.0 Vintage Tech OS</div>
            <div class="nav-controls" style="margin-left: 230px;">
                <i class="fa-solid fa-arrow-left" onclick="window.history.back()" title="后退"></i>
                <i class="fa-solid fa-arrow-right" onclick="window.history.forward()" title="前进"></i>
                <i class="fa-solid fa-rotate-right" onclick="window.location.reload()" title="刷新"></i>
            </div>
            <div class="address-bar">http://localhost:3000/vintage-tech-os</div>
            <div class="window-controls">
                <div class="win-btn" onclick="alert('最小化')" title="最小化"></div>
                <div class="win-btn" onclick="if(confirm('确定关闭？')) window.close()" title="关闭"></div>
            </div>
        </div>

        <div class="viewport">
            <div class="sidebar">
                
                <div class="sidebar-btn btn-green" onclick="showView('home')">
                    <i class="fa-solid fa-house"></i> 主页
                </div>
                <div class="sidebar-btn btn-pink" onclick="showView('create')">
                    <i class="fa-solid fa-plus"></i> 创建项目
                </div>
                <div class="sidebar-btn btn-green" onclick="showView('projects')">
                    <i class="fa-solid fa-folder-open"></i> 我的项目
                </div>
                <div class="sidebar-btn btn-blue" onclick="window.location.href='/retro'">
                    <i class="fa-solid fa-classic"></i> v2.2版本
                </div>

                <div class="spacer"></div>

                <div class="sidebar-btn btn-green" onclick="window.open('https://github.com/chittyking-sudo/storylineback1', '_blank')">
                    <i class="fa-brands fa-github"></i> GitHub
                </div>
                <div class="sidebar-btn btn-green" onclick="window.location.href='/retro/games'">
                    <i class="fa-solid fa-list"></i> 项目列表
                </div>

                <div class="footer-socials">
                    <div class="social-row">
                        <div class="social-icon"><i class="fa-brands fa-facebook-f"></i></div>
                        <div class="social-icon"><i class="fa-brands fa-twitter"></i></div>
                        <div class="social-icon"><i class="fa-brands fa-youtube"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-paper-plane"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-globe"></i></div>
                    </div>
                    <div class="copyright">© 2025 Game Generator v3.0</div>
                </div>
            </div>

            <div class="content">
                
                <!-- Home View -->
                <div id="home-view" class="view active">
                    <div class="hero">
                        <h1 class="hero-title">游戏内容</h1>
                        <h1 class="hero-title green">生成器</h1>
                        <div class="hero-subtitle-box">
                            基于 AI 的游戏内容自动生成系统 - Vintage Tech OS
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="section-title">欢迎使用 v3.0</div>
                        <div style="max-width: 800px; margin: 0 auto; text-align: center; padding: 40px;">
                            <p style="font-size: 18px; line-height: 1.8; margin-bottom: 30px;">
                                <strong>✨ 利用 AI 技术自动生成游戏内容</strong><br><br>
                                • 生成游戏世界观、剧情、角色和对话<br>
                                • 支持多种游戏类型和风格<br>
                                • 完全免费，本地存储
                            </p>
                            <div class="sidebar-btn btn-pink" onclick="showView('create')" style="max-width: 300px; margin: 0 auto; justify-content: center;">
                                <i class="fa-solid fa-magic"></i> 开始创作
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Create View -->
                <div id="create-view" class="view">
                    <div class="hero" style="min-height: 150px;">
                        <h1 class="hero-title" style="font-size: 48px;">创建新项目</h1>
                    </div>

                    <div class="form-section">
                        <div class="form-container">
                            <form id="create-form">
                                
                                <div class="form-group">
                                    <label class="form-label">
                                        项目名称 <span class="required">*</span>
                                    </label>
                                    <input type="text" class="form-input" id="project-name" 
                                           placeholder="例如：魔法学院大冒险" required>
                                    <div class="form-hint">为您的游戏项目起一个独特的名称</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        游戏类型 <span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="game-type" required>
                                        <option value="">请选择游戏类型</option>
                                        <option value="rpg">角色扮演游戏 (RPG)</option>
                                        <option value="adventure">冒险解谜</option>
                                        <option value="action">动作游戏</option>
                                        <option value="strategy">策略游戏</option>
                                        <option value="simulation">模拟经营</option>
                                        <option value="horror">恐怖惊悚</option>
                                        <option value="sci-fi">科幻太空</option>
                                        <option value="fantasy">奇幻魔法</option>
                                        <option value="mystery">悬疑推理</option>
                                        <option value="romance">恋爱养成</option>
                                    </select>
                                    <div class="form-hint">选择最符合您游戏主题的类型</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        生成内容类型 <span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="content-type" required>
                                        <option value="">请选择内容类型</option>
                                        <option value="worldview">世界观设定</option>
                                        <option value="story">主线剧情</option>
                                        <option value="quest">支线任务</option>
                                        <option value="character">角色设定</option>
                                        <option value="dialogue">对话脚本</option>
                                        <option value="item">道具装备</option>
                                        <option value="location">场景地点</option>
                                        <option value="full">完整内容(世界观+剧情+角色)</option>
                                    </select>
                                    <div class="form-hint">选择您想要生成的内容类型</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        详细描述（可选）
                                    </label>
                                    <textarea class="form-textarea" id="description" 
                                              placeholder="描述您的创意和需求，例如：&#10;• 故事发生在一个魔法与科技并存的世界&#10;• 主角是一名时间旅行者&#10;• 包含5个主要角色&#10;• 风格偏向黑暗奇幻&#10;&#10;详细的描述能帮助AI生成更符合您期望的内容..."></textarea>
                                    <div class="form-hint">越详细的描述，生成的内容越精准</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        AI 模型选择 <span class="required">*</span>
                                    </label>
                                    <select class="form-select" id="ai-model" required>
                                        <option value="gemini">Google Gemini 2.0 Flash (推荐 - 免费)</option>
                                        <option value="gpt4o-mini">OpenAI GPT-4o-mini (快速)</option>
                                        <option value="gpt4o">OpenAI GPT-4o (高质量)</option>
                                        <option value="claude">Anthropic Claude (创意)</option>
                                    </select>
                                    <div class="form-hint">不同模型有不同特点，Gemini 免费且效果好</div>
                                </div>

                                <div id="message-box" class="message"></div>
                                <div id="loading-box" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i> AI 正在努力生成内容，请稍候...
                                </div>

                                <button type="submit" class="btn-submit" id="submit-btn">
                                    <i class="fas fa-magic"></i> 开始生成
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Projects View -->
                <div id="projects-view" class="view">
                    <div class="hero" style="min-height: 150px;">
                        <h1 class="hero-title" style="font-size: 48px;">我的项目</h1>
                    </div>

                    <div class="form-section">
                        <div id="projects-list" class="projects-grid">
                            <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                                <i class="fas fa-folder-open" style="font-size: 64px; opacity: 0.3;"></i>
                                <p style="margin-top: 30px; font-size: 18px; opacity: 0.6;">暂无项目，点击"创建项目"开始生成内容</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script>
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
                        <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                            <i class="fas fa-folder-open" style="font-size: 64px; opacity: 0.3;"></i>
                            <p style="margin-top: 30px; font-size: 18px; opacity: 0.6;">暂无项目，点击"创建项目"开始生成内容</p>
                        </div>
                    \`;
                    return;
                }
                
                container.innerHTML = projects.map(project => \`
                    <div class="project-card" onclick="viewProject(\${project.id})">
                        <div class="project-title">\${project.name}</div>
                        <div class="project-desc">
                            <strong>类型:</strong> \${project.game_type || '未指定'}<br>
                            <strong>内容:</strong> \${project.content_type || '未指定'}
                        </div>
                        <div class="project-meta">
                            <i class="fas fa-calendar"></i> \${new Date(project.created_at).toLocaleDateString('zh-CN')}
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('加载项目失败:', error);
                showMessage('加载项目失败: ' + error.message, 'error');
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
                name: document.getElementById('project-name').value.trim(),
                game_type: document.getElementById('game-type').value,
                content_type: document.getElementById('content-type').value,
                description: document.getElementById('description').value.trim(),
                ai_model: document.getElementById('ai-model').value
            };
            
            // Validation
            if (!formData.name) {
                showMessage('请输入项目名称', 'error');
                return;
            }
            if (!formData.game_type) {
                showMessage('请选择游戏类型', 'error');
                return;
            }
            if (!formData.content_type) {
                showMessage('请选择内容类型', 'error');
                return;
            }
            
            // Show loading
            document.getElementById('loading-box').classList.add('active');
            document.getElementById('message-box').classList.remove('success', 'error');
            document.getElementById('message-box').style.display = 'none';
            document.getElementById('submit-btn').disabled = true;
            
            try {
                const response = await axios.post('/api/generate', formData);
                
                // Hide loading
                document.getElementById('loading-box').classList.remove('active');
                document.getElementById('submit-btn').disabled = false;
                
                if (response.data.success) {
                    showMessage('内容生成成功！正在跳转到项目详情...', 'success');
                    setTimeout(() => {
                        window.location.href = '/retro/games/' + response.data.project.id;
                    }, 1500);
                } else {
                    showMessage('生成失败: ' + (response.data.error || '未知错误'), 'error');
                }
                
            } catch (error) {
                document.getElementById('loading-box').classList.remove('active');
                document.getElementById('submit-btn').disabled = false;
                showMessage('生成失败: ' + (error.response?.data?.error || error.message), 'error');
                console.error('Generation error:', error);
            }
        });

        // Show message
        function showMessage(text, type) {
            const msgBox = document.getElementById('message-box');
            msgBox.textContent = text;
            msgBox.className = 'message ' + type;
        }

        // Initialize
        window.addEventListener('DOMContentLoaded', () => {
            console.log('Vintage Tech OS v3.0 initialized');
        });
    </script>

</body>
</html>
  `);
});

export default vintage;
