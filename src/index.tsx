import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// Mount API routes
app.route('/api', api);

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>多Agent协作游戏内容生成器</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .agent-card {
            transition: all 0.3s ease;
          }
          .agent-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .loading {
            display: none;
          }
          .loading.active {
            display: block;
          }
          .status-generating { color: #f59e0b; }
          .status-completed { color: #10b981; }
          .status-failed { color: #ef4444; }
          .status-partial { color: #3b82f6; }
        </style>
    </head>
    <body class="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-robot mr-3 text-purple-600"></i>
                    多Agent协作游戏内容生成器
                </h1>
                <p class="text-xl text-gray-600">
                    基于 AI 多智能体协作，自动生成游戏世界观、剧情、角色和对话
                </p>
            </div>

            <!-- Agent Architecture -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">
                    <i class="fas fa-network-wired mr-2 text-blue-600"></i>
                    Agent 协作架构
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="agent-card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                        <i class="fas fa-globe text-4xl mb-3"></i>
                        <h3 class="text-xl font-bold mb-2">世界观设计 Agent</h3>
                        <p class="text-sm opacity-90">构建游戏世界的历史、地理、文化体系</p>
                        <div class="mt-3 text-xs opacity-75">Model: GPT-4</div>
                    </div>
                    <div class="agent-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                        <i class="fas fa-book-open text-4xl mb-3"></i>
                        <h3 class="text-xl font-bold mb-2">剧情架构 Agent</h3>
                        <p class="text-sm opacity-90">设计主线支线剧情、冲突和转折</p>
                        <div class="mt-3 text-xs opacity-75">Model: GPT-4</div>
                    </div>
                    <div class="agent-card bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                        <i class="fas fa-users text-4xl mb-3"></i>
                        <h3 class="text-xl font-bold mb-2">角色创建 Agent</h3>
                        <p class="text-sm opacity-90">生成立体角色、性格背景和关系网</p>
                        <div class="mt-3 text-xs opacity-75">Model: GPT-4</div>
                    </div>
                    <div class="agent-card bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                        <i class="fas fa-comments text-4xl mb-3"></i>
                        <h3 class="text-xl font-bold mb-2">对话生成 Agent</h3>
                        <p class="text-sm opacity-90">创作符合角色性格的生动对话</p>
                        <div class="mt-3 text-xs opacity-75">Model: GPT-4</div>
                    </div>
                </div>
            </div>

            <!-- Generation Form -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">
                    <i class="fas fa-magic mr-2 text-purple-600"></i>
                    创建新项目
                </h2>
                <form id="generateForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">项目名称</label>
                        <input type="text" id="projectName" required
                               class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                               placeholder="例：幻想大陆冒险">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">游戏类型</label>
                            <select id="gameType" required
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition">
                                <option value="">选择类型</option>
                                <option value="RPG">角色扮演 (RPG)</option>
                                <option value="冒险">冒险游戏</option>
                                <option value="策略">策略游戏</option>
                                <option value="模拟">模拟经营</option>
                                <option value="解谜">解谜游戏</option>
                                <option value="动作">动作游戏</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">角色数量</label>
                            <input type="number" id="characterCount" min="3" max="10" value="5"
                                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">主题描述</label>
                        <textarea id="theme" required rows="3"
                                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                                  placeholder="例：在一个被魔法和科技共存的世界，主角需要寻找失落的古代文明遗迹，揭开世界的真相"></textarea>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="generateDialogues" checked
                               class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                        <label class="ml-3 text-sm font-medium text-gray-700">生成示例对话</label>
                    </div>
                    <button type="submit"
                            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition duration-200 shadow-lg">
                        <i class="fas fa-rocket mr-2"></i>
                        开始生成
                    </button>
                </form>
                
                <!-- Loading State -->
                <div id="loadingState" class="loading mt-8">
                    <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                        <div class="flex items-center justify-center mb-4">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                        <p class="text-center text-blue-800 font-semibold">AI Agents 正在协作生成内容...</p>
                        <p class="text-center text-blue-600 text-sm mt-2">这可能需要 1-2 分钟，请耐心等待</p>
                    </div>
                </div>
            </div>

            <!-- Projects List -->
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">
                    <i class="fas fa-folder-open mr-2 text-green-600"></i>
                    项目列表
                </h2>
                <div id="projectsList" class="space-y-4">
                    <p class="text-gray-500 text-center py-8">加载中...</p>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app;
