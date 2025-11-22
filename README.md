# 多Agent协作游戏内容生成器

基于 AI 多智能体协作的游戏内容自动生成系统，可自动生成游戏世界观、剧情、角色和对话。

## 🎯 项目概述

- **名称**: Multi-Agent Game Generator
- **目标**: 利用多个 AI Agent 协作，自动化生成完整的游戏内容框架
- **技术栈**: Hono + TypeScript + Cloudflare Workers + Cloudflare D1

## 🌐 在线访问

- **🆕 v3.0 (主页 - 默认)**: https://3000-imt0hr8ioseb4qc1ytnn4-2b54fc91.sandbox.novita.ai
- **v2.2 经典版**: https://3000-imt0hr8ioseb4qc1ytnn4-2b54fc91.sandbox.novita.ai/retro
- **游戏项目详情**: https://3000-imt0hr8ioseb4qc1ytnn4-2b54fc91.sandbox.novita.ai/retro/games/projects
- **API 健康检查**: https://3000-imt0hr8ioseb4qc1ytnn4-2b54fc91.sandbox.novita.ai/api/health
- **GitHub 仓库**: https://github.com/chittyking-sudo/storylineback1
- **项目备份**: https://www.genspark.ai/api/files/s/sOteVxeu

## ✨ 核心功能

### 🎉 v2.0 新增功能

1. **多种生成模式**
   - 仅生成世界观
   - 世界观 + 角色
   - 完整生成（世界观+剧情+角色+对话）

2. **多模型支持**
   - OpenAI GPT-4o-mini（默认，性价比高）
   - Google Gemini（免费，创意性强）
   - OpenAI GPT-4o（质量最高）
   - 支持多模型同时生成和对比

3. **分阶段生成**
   - 世界观详情页可继续生成角色
   - 世界观详情页可生成对话
   - 角色详情页可生成对话
   - 灵活的内容扩展

4. **模型测试功能**
   - 多模型对比测试
   - 实时查看不同模型输出
   - Token 消耗统计
   - 帮助选择最佳模型

### 已完成功能

1. **世界观生成** (多模型支持)
   - 历史背景构建
   - 地理环境设定
   - 文化体系创建
   - 传说故事编写
   - 支持多模型对比

2. **剧情架构生成** (GPT-4)
   - 主线剧情设计
   - 三幕结构规划
   - 冲突点设置
   - 角色成长弧线

3. **角色创建** (多模型支持)
   - 角色性格塑造
   - 背景故事编写
   - 外貌描述
   - 关系网络构建
   - 支持多模型对比

4. **对话生成** (GPT-4)
   - 符合角色性格的对话
   - 情感状态标注
   - 场景化对话脚本
   - 支持特定场景定制

5. **内容导出**
   - JSON 格式导出
   - Markdown 格式导出
   - 完整项目数据备份

### 待实现功能

- 一致性检查 Agent (自动检测逻辑冲突)
- 质量评估 Agent (评分和优化建议)
- 支线剧情生成
- 更多角色对话场景
- 游戏机制建议

## 🏗️ 系统架构

### Agent 协作流程

```
用户输入
   ↓
Master Orchestrator
   ↓
1. 世界观设计 Agent (GPT-4o-mini)
   ↓
2. 剧情架构 Agent (GPT-4o-mini)
   ↓
3. 角色创建 Agent (Claude-3-Sonnet) [并行]
   ↓
4. 对话生成 Agent (GPT-4o-mini)
   ↓
结果整合 & 保存
```

### 技术栈详情

- **后端框架**: Hono (轻量级 Web 框架)
- **运行时**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **AI 模型**:
  - OpenAI GPT-4o-mini (世界观、剧情、角色、对话)
  - Google Gemini (备用)
- **前端**: HTML + TailwindCSS + Vanilla JS

## 📊 数据模型

### 数据库表结构

1. **projects** - 项目信息
2. **worldviews** - 世界观内容
3. **storylines** - 剧情架构
4. **characters** - 角色数据
5. **dialogues** - 对话脚本
6. **generation_logs** - 生成日志

详细 Schema 请查看 `migrations/0001_initial_schema.sql`

## 🚀 API 接口

### 核心 API 端点

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| POST | `/api/generate` | 创建新项目并生成内容 | projectName, gameType, theme, characterCount, generateDialogues |
| GET | `/api/projects` | 获取所有项目列表 | - |
| GET | `/api/projects/:id` | 获取项目详情 | id |
| GET | `/api/projects/:id/export` | 导出项目 | id, format (json/markdown) |
| GET | `/api/health` | 健康检查 | - |

### 示例请求

#### 创建新项目

```bash
curl -X POST https://your-domain.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "魔法大陆冒险",
    "gameType": "RPG",
    "theme": "一个被魔法和科技共存的世界，主角需要寻找失落的古代文明遗迹",
    "characterCount": 5,
    "generateDialogues": true
  }'
```

#### 获取项目列表

```bash
curl https://your-domain.com/api/projects
```

#### 导出项目

```bash
# JSON 格式
curl https://your-domain.com/api/projects/1/export?format=json

# Markdown 格式
curl https://your-domain.com/api/projects/1/export?format=markdown
```

## 📖 使用指南

### 本地开发

1. **安装依赖**
```bash
npm install
```

2. **应用数据库迁移**
```bash
npm run db:migrate:local
```

3. **构建项目**
```bash
npm run build
```

4. **启动开发服务器**
```bash
npm run dev:d1
# 或使用 PM2
pm2 start ecosystem.config.cjs
```

5. **访问应用**
```
http://localhost:3000
```

### 生产部署

**部署到 Cloudflare Pages**:

1. **配置 API 密钥**
```bash
# 设置为 Cloudflare Secrets
wrangler pages secret put OPENAI_API_KEY
wrangler pages secret put ANTHROPIC_API_KEY
wrangler pages secret put GOOGLE_API_KEY
```

2. **创建 D1 数据库**
```bash
wrangler d1 create game-generator-db
# 将返回的 database_id 更新到 wrangler.jsonc
```

3. **应用生产数据库迁移**
```bash
npm run db:migrate:prod
```

4. **部署应用**
```bash
npm run deploy:prod
```

## 🎮 使用示例

### 创建一个 RPG 游戏项目

1. 访问主页
2. 填写项目信息:
   - 项目名称: "星际探险"
   - 游戏类型: RPG
   - 主题: "2080年，人类殖民火星，主角是一名太空探险家，需要调查神秘信号"
   - 角色数量: 5
3. 点击"开始生成"
4. 等待 1-2 分钟，AI Agents 协作完成
5. 查看生成的世界观、剧情、角色和对话
6. 导出为 JSON 或 Markdown

### 生成内容示例

**世界观**:
- 标题: 星际联邦 2080
- 历史: 2050年人类首次登陆火星...
- 地理: 火星表面分为7个殖民区...
- 文化: 地球与火星文化融合...
- 传说: 古代火星文明的传说...

**角色**:
- 主角: 李明 (太空探险家)
- 配角: 艾莉森博士 (科学家)
- NPC: 商人、军官、神秘人等

## 📈 性能指标

- **单次生成时间**: 60-120秒
- **Token 消耗**: 约 5000-10000 tokens/项目
- **并发支持**: 基于 Cloudflare Workers 的高并发能力
- **数据库**: Cloudflare D1 全球分布

## 🔐 安全说明

- API 密钥存储在 `.dev.vars` (本地) 和 Cloudflare Secrets (生产)
- `.dev.vars` 文件已加入 `.gitignore`，不会提交到 Git
- 所有 API 调用在后端执行，前端不暴露密钥

## 🛠️ 开发工具

### NPM 脚本

```bash
# 开发
npm run dev              # Vite 开发服务器
npm run dev:sandbox      # Wrangler 本地开发
npm run dev:d1           # 带 D1 数据库的开发

# 构建和部署
npm run build            # 构建项目
npm run deploy           # 部署到 Cloudflare
npm run deploy:prod      # 生产环境部署

# 数据库
npm run db:migrate:local # 本地数据库迁移
npm run db:migrate:prod  # 生产数据库迁移
npm run db:reset         # 重置本地数据库
npm run db:console:local # 本地数据库控制台

# 工具
npm run clean-port       # 清理 3000 端口
npm run test             # 测试服务
```

## 🐛 故障排除

### 端口占用
```bash
npm run clean-port
# 或
fuser -k 3000/tcp
```

### 数据库重置
```bash
npm run db:reset
```

### 查看日志
```bash
pm2 logs game-generator --nostream
```

### 重启服务
```bash
pm2 restart game-generator
```

## 📝 推荐下一步

1. **增强功能**
   - 添加一致性检查 Agent
   - 实现质量评估系统
   - 支持更多游戏类型

2. **性能优化**
   - 实现结果缓存
   - 优化 Token 使用
   - 添加进度反馈

3. **用户体验**
   - 添加实时生成进度
   - 支持项目编辑
   - 增加更多导出格式

4. **部署**
   - 配置自定义域名
   - 设置 CI/CD 流程
   - 添加监控和日志

## 📄 许可证

ISC License

## 👥 贡献者

- AI Assistant - 初始开发

## 📞 联系方式

如有问题或建议，请创建 Issue 或 Pull Request。

---

**最后更新**: 2024-11-22
**项目状态**: ✅ 运行中
**当前版本**: v3.0 (默认主页) + v2.2 (经典版)

## 🔄 最新更新 (2024-11-22)

**重大架构调整**:
- ❌ **删除 v2.3 和旧 v3.0** - 简化版本管理，只保留两个核心版本
- ✅ **新 v3.0 成为主页** - 基于新设计的复古风格作为默认入口
- ✅ **v2.2 修复和优化** - 修复游戏类型下拉框显示问题
- ✅ **统一表单逻辑** - v2.2 和 v3.0 使用完全相同的创建功能

**v3.0 新版本特点**:
- 🎨 1200x800 浏览器窗口设计（与新附件一致）
- 🎨 全新配色：#ebddc3 (米色), #ef7ca6 (粉色), #57ae77 (绿色)
- 🎨 窗口化界面，左侧导航栏 + 右侧主内容区
- 🎨 完整的创建项目表单（与 v2.2 完全相同）
- 🎨 10种游戏类型，8种内容类型
- 🎨 多视图切换（主页、创建、项目）

**v2.2 修复**:
- 🔧 修复 `.form-select` 的 `appearance: none` 导致下拉选项不显示的问题
- ✅ 保持原有配色和字体（Pixeloid Sans + FZG CN）
- ✅ 保持 1200x800 窗口尺寸

## 🆕 v3.0 更新内容

**全新复古风格界面** (v3.0):
- ✅ **浏览器窗口设计** - 模拟经典浏览器界面
- ✅ **左侧导航栏** - 主页、创建、项目快速切换
- ✅ **Hero 区域** - 黑色背景 + 粉色棋盘纹理
- ✅ **完整创建功能** - 与 v2.2 完全相同的表单逻辑
- ✅ **统一配色方案** - #ebddc3, #ef7ca6, #57ae77, #5c7cfa
- ✅ **响应式设计** - 完美适配桌面和平板

### v3.0 配色方案

- 背景: `#ebddc3` (米色)
- 主色: `#ef7ca6` (粉色)
- 次色: `#57ae77` (绿色)
- 强调: `#5c7cfa` (蓝色)
- 边框: `#000000` (黑色)

### v3.0 布局设计

```
┌─────────────────────────────────────────────┐
│ 🌐 地址栏 (导航控件 + URL)                   │
├──────────┬──────────────────────────────────┤
│          │ 🎨 Hero 区域                     │
│  📌      │  (棋盘背景 + 大标题)              │
│  主页    ├──────────────────────────────────┤
│  创建    │ 📝 表单区域                       │
│  项目    │  (项目名称、游戏类型、内容类型)   │
│  GitHub  │                                  │
│          │ 🎮 项目列表                       │
│  社交    │  (卡片网格展示)                   │
│  图标    │                                  │
└──────────┴──────────────────────────────────┘
```

## 🆕 v2.2 更新内容

**复古网页体验** (v2.2):
- ✅ **90年代复古风格页面** - 怀旧的视觉设计
- ✅ **交互式导航** - 动态页面切换和动画效果
- ✅ **中文本地化** - 完整的中文界面
- ✅ **游戏生成器集成** - 复古风格查看项目列表和详情
- ✅ **响应式设计** - 适配各种屏幕尺寸

## 🆕 v2.1 更新内容

查看完整功能说明: [FEATURES.md](FEATURES.md)

**最新更新** (v2.1):
- ✅ **世界观风格预设** - 6大类专业模板
  - 电影剧本：喜剧、解谜、悬疑、言情
  - 游戏世界：魔幻游戏、乙女游戏
  - 自定义：完全自由设定
- ✅ **动态类型细分** - 每种风格下的详细分类
- ✅ **优化的生成策略** - 针对不同风格调整 Prompt

查看世界观风格详细说明: [WORLDVIEW_STYLES.md](WORLDVIEW_STYLES.md)

**v2.0 更新**:
- ✅ 3种生成模式（世界观、世界观+角色、完整）
- ✅ 多模型支持（OpenAI GPT-4o-mini/4o, Google Gemini）
- ✅ 分阶段生成（可在任意阶段添加内容）
- ✅ 模型测试功能（对比不同模型输出）
- ✅ 优化的用户界面
