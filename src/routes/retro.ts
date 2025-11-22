import { Hono } from 'hono';

const retro = new Hono();

const retroHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retro Web Explorer - v2025</title>
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
            --retro-dark-blue: #415bc4;
            --border-color: #000100;
            --shadow: 4px 4px 0px #000100;
            --font-main: 'Pixeloid Sans', 'Arial Black', 'Impact', sans-serif;
            --font-ui: 'FZG CN', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
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

        /* Main Browser Window */
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

        .window-title {
            position: absolute;
            top: -25px;
            left: 20px;
            background: var(--retro-pink);
            color: black;
            padding: 2px 10px;
            font-weight: bold;
            font-size: 12px;
            border: 2px solid black;
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

        .btn-green { background: var(--retro-green); }
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
        }

        .copyright {
            font-size: 12px;
            font-weight: bold;
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
                linear-gradient(45deg, #ff85c2 25%, transparent 25%), 
                linear-gradient(-45deg, #ff85c2 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #ff85c2 75%), 
                linear-gradient(-45deg, transparent 75%, #ff85c2 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            position: relative;
            padding: 40px;
            text-align: center;
            border-bottom: 3px solid var(--border-color);
            min-height: 350px;
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
            opacity: 0.8; 
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

        /* Grid Section */
        .grid-section {
            padding: 20px;
            background: white;
            display: flex;
            gap: 20px;
            flex: 1;
            border-bottom: 20px solid black; 
            background-image: repeating-linear-gradient(
                90deg,
                var(--retro-green) 0,
                var(--retro-green) 20px,
                black 20px,
                black 40px
            );
            background-size: 100% 20px;
            background-repeat: no-repeat;
            background-position: bottom;
            padding-bottom: 40px;
        }

        .card {
            flex: 1;
            border: 2px solid black;
            background: var(--bg-beige);
            box-shadow: 5px 5px 0px black;
            display: flex;
            flex-direction: column;
        }

        .card-header {
            background: var(--retro-pink);
            border-bottom: 2px solid black;
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .card-header.green { background: var(--retro-green); }

        .win-icons {
            display: flex;
            gap: 2px;
        }
        .win-icon-box {
            width: 12px; height: 12px; border: 1px solid black; background: white;
        }

        .card-body {
            padding: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            background: var(--retro-green);
        }
        
        .illustration-placeholder {
            width: 100%;
            height: 100px;
            background: #e0e0e0;
            border: 2px solid black;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: #333;
        }

        .card:nth-child(1) .card-body { background: #e6aeb8; }
        .card:nth-child(2) .card-body { background: #6dc9a6; }
        .card:nth-child(3) .card-body { background: #e6aeb8; }

        .card-btn-lg {
            width: 100%;
            padding: 10px;
            background: var(--retro-pink);
            border: 2px solid black;
            font-weight: bold;
            text-align: center;
            font-size: 20px;
            font-family: var(--font-main);
            text-transform: uppercase;
        }
        
        .card:nth-child(2) .card-btn-lg { background: var(--retro-green); }

    </style>
</head>
<body>

    <div class="browser-window">
        <div class="window-header">
            <div style="position:absolute; top:10px; left:10px; font-size:10px; font-weight:bold; color:#555;">RETRO WEB EXPLORER - v2025</div>
            <div class="nav-controls" style="margin-left: 180px;">
                <i class="fa-solid fa-arrow-left"></i>
                <i class="fa-solid fa-arrow-right"></i>
                <i class="fa-solid fa-rotate-right"></i>
            </div>
            <div class="address-bar">http://www.retroweb.net/home</div>
            <div class="window-controls">
                <div class="win-btn"></div>
                <div class="win-btn"></div>
            </div>
        </div>

        <div class="viewport">
            <div class="sidebar">
                
                <div class="sidebar-btn btn-green">
                    <i class="fa-solid fa-house"></i> 主页
                </div>
                <div class="sidebar-btn btn-green">
                    <i class="fa-solid fa-compass"></i> 探索
                </div>
                <div class="sidebar-btn btn-green">
                    <i class="fa-solid fa-compact-disc"></i> 发现
                </div>
                <div class="sidebar-btn btn-green">
                    <i class="fa-solid fa-brain"></i> 回忆
                </div>

                <div class="spacer"></div>

                <div class="sidebar-btn btn-pink">
                    <i class="fa-solid fa-book"></i> 我的收藏
                </div>
                <div class="sidebar-btn btn-green">
                    <i class="fa-solid fa-border-all"></i> 创建列表
                </div>
                <div class="sidebar-btn btn-green">
                    <i class="fa-solid fa-heart"></i> 喜欢内容
                </div>

                <div class="footer-socials">
                    <div class="social-row">
                        <div class="social-icon"><i class="fa-brands fa-facebook-f"></i></div>
                        <div class="social-icon"><i class="fa-brands fa-xing"></i></div>
                        <div class="social-icon"><i class="fa-brands fa-youtube"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-paper-plane"></i></div>
                        <div class="social-icon"><i class="fa-solid fa-globe"></i></div>
                    </div>
                    <div class="copyright">© 2025 Retro Web Project</div>
                </div>
            </div>

            <div class="content">
                
                <div class="hero">
                    <h1 class="hero-title">欢迎来到</h1>
                    <h1 class="hero-title green">复古网络</h1>
                    <div class="hero-subtitle-box">
                        体验怀旧的复古计算机魅力 - 90年代风格重现
                    </div>
                </div>

                <div class="grid-section">
                    
                    <div class="card">
                        <div class="card-header">
                            探索世界
                            <div class="win-icons"><div class="win-icon-box"></div><div class="win-icon-box"></div></div>
                        </div>
                        <div class="card-body">
                            <div class="illustration-placeholder">
                                <i class="fa-solid fa-computer"></i>
                            </div>
                            <p style="padding: 10px; text-align: center; font-weight: bold;">探索早期互联网的隐藏宝藏和经典内容</p>
                            </div>
                        <div class="card-btn-lg">开始探索</div>
                    </div>

                    <div class="card">
                        <div class="card-header green">
                            发现精彩
                            <div class="win-icons"><div class="win-icon-box"></div><div class="win-icon-box"></div></div>
                        </div>
                        <div class="card-body">
                             <div class="illustration-placeholder">
                                <i class="fa-regular fa-floppy-disk"></i>
                            </div>
                            <p style="padding: 10px; text-align: center; font-weight: bold;">发掘计算机黄金时代的精彩故事</p>
                        </div>
                        <div class="card-btn-lg">立即发现</div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            回忆往昔
                            <div class="win-icons"><div class="win-icon-box"></div><div class="win-icon-box"></div></div>
                        </div>
                        <div class="card-body">
                             <div class="illustration-placeholder">
                                <i class="fa-solid fa-window-restore"></i>
                            </div>
                            <p style="padding: 10px; text-align: center; font-weight: bold;">重温拨号上网和软盘时代的美好回忆</p>
                        </div>
                        <div class="card-btn-lg">回忆过去</div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <script>
        // Current page state
        let currentPage = 'home';
        
        // Page content definitions
        const pages = {
            home: {
                title: '欢迎来到',
                subtitle: '复古网络',
                description: '体验怀旧的复古计算机魅力 - 90年代风格重现'
            },
            explore: {
                title: '探索',
                subtitle: '数字世界',
                description: '发现早期互联网时代的隐藏宝藏'
            },
            discover: {
                title: '发现新的',
                subtitle: '冒险旅程',
                description: '揭开计算机黄金时代的精彩故事'
            },
            remember: {
                title: '回忆',
                subtitle: '美好时光',
                description: '重温拨号上网和软盘时代的美好回忆'
            },
            library: {
                title: '你的个人',
                subtitle: '资料库',
                description: '访问你保存的内容和收藏集'
            },
            games: {
                title: '游戏内容',
                subtitle: '生成器',
                description: '使用 AI 智能体创造精彩的游戏世界'
            }
        };

        // Navigation function
        function navigateTo(page) {
            currentPage = page;
            updateAddressBar(page);
            updateHeroSection(page);
            animatePageTransition();
        }

        // Update address bar
        function updateAddressBar(page) {
            const addressBar = document.querySelector('.address-bar');
            addressBar.style.opacity = '0';
            setTimeout(() => {
                addressBar.textContent = \`http://www.retroweb.net/\${page}\`;
                addressBar.style.opacity = '1';
            }, 150);
        }

        // Update hero section
        function updateHeroSection(page) {
            const pageData = pages[page] || pages.home;
            const hero = document.querySelector('.hero');
            const titles = hero.querySelectorAll('.hero-title');
            const subtitle = hero.querySelector('.hero-subtitle-box');
            
            hero.style.opacity = '0';
            setTimeout(() => {
                titles[0].textContent = pageData.title;
                titles[1].textContent = pageData.subtitle;
                subtitle.textContent = pageData.description;
                hero.style.opacity = '1';
            }, 200);
        }

        // Animate page transition
        function animatePageTransition() {
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                card.style.transform = 'translateY(20px)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, 100 * index);
            });
        }

        // Button click effects
        function setupButtonEffects() {
            // Sidebar buttons
            const sidebarBtns = document.querySelectorAll('.sidebar-btn');
            sidebarBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const pages = ['home', 'explore', 'discover', 'remember', 'library', 'playlist', 'liked'];
                    if (index === 4) navigateTo('library');
                    else if (index < 4) navigateTo(pages[index]);
                    
                    // Visual feedback
                    btn.style.background = '#ffd700';
                    setTimeout(() => {
                        btn.classList.contains('btn-green') 
                            ? btn.style.background = '#45c4a0'
                            : btn.style.background = '#ff85c2';
                    }, 200);
                });
            });

            // Card buttons
            const cardBtns = document.querySelectorAll('.card-btn-lg');
            cardBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const pages = ['explore', 'discover', 'remember'];
                    navigateTo(pages[index]);
                });
            });

            // Cards themselves
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'scale(1.05)';
                    card.style.transition = 'transform 0.2s ease';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'scale(1)';
                });
            });

            // Browser navigation buttons
            document.querySelectorAll('.nav-controls i').forEach((icon, index) => {
                icon.addEventListener('click', () => {
                    if (index === 0) history.back();
                    else if (index === 1) history.forward();
                    else if (index === 2) location.reload();
                    
                    icon.style.color = '#ff85c2';
                    setTimeout(() => icon.style.color = '#555', 200);
                });
            });
        }

        // Social icons animation
        function setupSocialIcons() {
            const socialIcons = document.querySelectorAll('.social-icon');
            socialIcons.forEach(icon => {
                icon.addEventListener('click', () => {
                    icon.style.transform = 'rotate(360deg) scale(1.2)';
                    icon.style.transition = 'transform 0.5s ease';
                    setTimeout(() => {
                        icon.style.transform = 'rotate(0deg) scale(1)';
                    }, 500);
                });
            });
        }

        // Add "Game Generator" link
        function addGameGeneratorLink() {
            const sidebar = document.querySelector('.sidebar');
            const spacer = document.createElement('div');
            spacer.className = 'spacer';
            sidebar.insertBefore(spacer, sidebar.querySelector('.footer-socials'));
            
            const gameGenBtn = document.createElement('div');
            gameGenBtn.className = 'sidebar-btn btn-pink';
            gameGenBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 游戏生成器';
            gameGenBtn.style.animation = 'pulse 2s infinite';
            gameGenBtn.addEventListener('click', () => {
                navigateTo('games');
                setTimeout(() => {
                    window.open('/', '_blank');
                }, 500);
            });
            sidebar.insertBefore(gameGenBtn, sidebar.querySelector('.footer-socials'));
            
            // Add "View Projects" button
            const viewProjectsBtn = document.createElement('div');
            viewProjectsBtn.className = 'sidebar-btn btn-green';
            viewProjectsBtn.innerHTML = '<i class="fa-solid fa-folder-open"></i> 查看项目';
            viewProjectsBtn.addEventListener('click', () => {
                window.location.href = '/retro/games/projects';
            });
            sidebar.insertBefore(viewProjectsBtn, sidebar.querySelector('.footer-socials'));
        }

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            .address-bar {
                transition: opacity 0.3s ease;
            }
            .hero {
                transition: opacity 0.4s ease;
            }
        \`;
        document.head.appendChild(style);

        // Initialize on load
        document.addEventListener('DOMContentLoaded', () => {
            setupButtonEffects();
            setupSocialIcons();
            addGameGeneratorLink();
            console.log('🎮 Retro Web Explorer v2025 - Ready!');
        });
    </script>

</body>
</html>`;

retro.get('/', (c) => {
  return c.html(retroHTML);
});

export default retro;
