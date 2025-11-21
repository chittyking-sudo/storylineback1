# 多Agent协作游戏内容生成器 - 部署指南

## 📦 项目信息

- **项目名称**: Multi-Agent Game Generator
- **GitHub**: https://github.com/chittyking-sudo/storylineback1
- **在线演示**: https://3000-imt0hr8ioseb4qc1ytnn4-2b54fc91.sandbox.novita.ai
- **版本**: v1.1-fixed
- **备份下载**: https://www.genspark.ai/api/files/s/NffocbsI

## 🚀 快速部署指南

### 方法 1: 从 GitHub 克隆

```bash
# 1. 克隆仓库
git clone https://github.com/chittyking-sudo/storylineback1.git
cd storylineback1

# 2. 安装依赖
npm install

# 3. 配置 API 密钥（创建 .dev.vars 文件）
cat > .dev.vars << 'EOF'
OPENAI_API_KEY=your-openai-api-key-here
GOOGLE_API_KEY=your-google-api-key-here
EOF

# 4. 应用数据库迁移
npm run db:migrate:local

# 5. 构建项目
npm run build

# 6. 启动服务
pm2 start ecosystem.config.cjs

# 7. 访问应用
# 打开浏览器访问: http://localhost:3000
```

### 方法 2: 从备份恢复

```bash
# 1. 下载备份
wget https://www.genspark.ai/api/files/s/NffocbsI -O multi-agent-game-generator.tar.gz

# 2. 解压
tar -xzf multi-agent-game-generator.tar.gz

# 3. 进入项目目录
cd /home/user/webapp

# 4. 安装依赖
npm install

# 5-7. 同上（配置 API、迁移数据库、构建、启动）
```

## 🔑 API 密钥配置

### 本地开发环境

创建 `.dev.vars` 文件（此文件已在 .gitignore 中，不会被提交到 Git）：

```bash
OPENAI_API_KEY=sk-proj-your-key-here
GOOGLE_API_KEY=AIza-your-key-here
```

### 生产环境（Cloudflare Pages）

使用 Cloudflare Secrets 存储 API 密钥：

```bash
# 1. 创建 D1 数据库
npx wrangler d1 create game-generator-db

# 2. 更新 wrangler.jsonc 中的 database_id

# 3. 设置 Secrets
npx wrangler pages secret put OPENAI_API_KEY --project-name multi-agent-game-generator
npx wrangler pages secret put GOOGLE_API_KEY --project-name multi-agent-game-generator

# 4. 应用生产数据库迁移
npm run db:migrate:prod

# 5. 部署到 Cloudflare Pages
npm run deploy:prod
```

## 📊 系统架构

### Agent 工作流

```
用户输入 → Master Orchestrator
    ↓
1. 世界观设计 Agent (GPT-4o-mini)
    ↓
2. 剧情架构 Agent (GPT-4o-mini)
    ↓
3. 角色创建 Agent (GPT-4o-mini)
    ↓
4. 对话生成 Agent (GPT-4o-mini)
    ↓
结果保存到 D1 数据库
```

### 技术栈

| 组件 | 技术 |
|------|------|
| 后端框架 | Hono |
| 运行时 | Cloudflare Workers |
| 数据库 | Cloudflare D1 (SQLite) |
| AI 模型 | OpenAI GPT-4o-mini |
| 前端 | HTML + TailwindCSS + Vanilla JS |
| 部署 | Cloudflare Pages |

## 🛠️ 常用命令

### 开发命令

```bash
# 启动开发服务器
npm run dev:d1

# 构建项目
npm run build

# 重启服务
pm2 restart game-generator

# 查看日志
pm2 logs game-generator --nostream
```

### 数据库命令

```bash
# 本地数据库迁移
npm run db:migrate:local

# 生产数据库迁移
npm run db:migrate:prod

# 重置本地数据库
npm run db:reset

# 数据库控制台
npm run db:console:local
```

### Git 命令

```bash
# 查看状态
npm run git:status

# 提交更改
npm run git:commit "Your commit message"

# 查看日志
npm run git:log

# 推送到 GitHub
git push origin main
```

## 🔧 故障排除

### 端口被占用

```bash
# 清理端口
npm run clean-port

# 或手动清理
fuser -k 3000/tcp
```

### 数据库错误

```bash
# 重置数据库
npm run db:reset

# 重新应用迁移
npm run db:migrate:local
```

### API 调用失败

1. 检查 `.dev.vars` 文件是否存在
2. 确认 API 密钥是否正确
3. 检查 OpenAI API 余额
4. 查看 PM2 日志排查错误

### 构建失败

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📈 性能优化建议

### 1. 成本控制

- 使用 GPT-4o-mini 而不是 GPT-4（成本低 90%）
- 实现结果缓存机制
- 设置 Token 使用上限
- 监控 API 使用量

### 2. 速度优化

- 使用 PM2 cluster 模式
- 启用 HTTP/2
- 配置 CDN 加速
- 优化数据库查询

### 3. 质量提升

- 优化 Prompt 设计
- 增加示例（Few-shot）
- 实现多轮迭代
- 添加人工审核点

## 🔐 安全建议

### API 密钥安全

1. **永远不要**将 `.dev.vars` 提交到 Git
2. 使用 Cloudflare Secrets 存储生产密钥
3. 定期轮换 API 密钥
4. 设置 API 使用限额

### 数据库安全

1. 启用 D1 数据库备份
2. 限制数据库访问权限
3. 定期审计数据访问日志
4. 加密敏感数据

### 应用安全

1. 启用 CORS 保护
2. 添加请求频率限制
3. 实现用户认证
4. 定期更新依赖

## 📞 技术支持

### 问题报告

如遇到问题，请在 GitHub 提交 Issue：
https://github.com/chittyking-sudo/storylineback1/issues

### 文档资源

- [Hono 文档](https://hono.dev/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [OpenAI API 文档](https://platform.openai.com/docs/)

## 📝 版本历史

### v1.1-fixed (2024-11-21)
- ✅ 修复 D1 数据库类型错误
- ✅ 切换所有 Agent 到 OpenAI GPT-4o-mini
- ✅ 移除 Anthropic API 依赖
- ✅ 更新文档和 README
- ✅ 推送到 GitHub

### v1.0 (2024-11-21)
- ✅ 初始版本发布
- ✅ 4 个 Agent 实现
- ✅ Master Orchestrator
- ✅ Web 界面
- ✅ 数据导出功能

## 🎯 下一步计划

### 短期（1-2 周）
- [ ] 添加实时进度反馈（SSE）
- [ ] 实现结果缓存机制
- [ ] 支持项目编辑功能
- [ ] 添加更多游戏类型模板

### 中期（1-2 月）
- [ ] 实现一致性检查 Agent
- [ ] 添加质量评估系统
- [ ] 支持支线剧情生成
- [ ] 增加更多对话场景

### 长期（3-6 月）
- [ ] 多语言支持
- [ ] 用户系统和权限管理
- [ ] 团队协作功能
- [ ] 游戏引擎集成

---

**部署状态**: ✅ 生产就绪  
**最后更新**: 2024-11-21  
**维护者**: chittyking-sudo
