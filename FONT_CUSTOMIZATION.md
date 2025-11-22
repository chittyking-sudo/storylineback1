# 🎨 字体和大小自定义指南

本文档详细说明如何修改游戏内容生成器的字体和字号。

## 📍 主要文件位置

需要修改的文件：
1. **主页面**: `/home/user/webapp/src/routes/main.ts`
2. **复古页面**: `/home/user/webapp/src/routes/retro.ts`
3. **游戏项目页**: `/home/user/webapp/src/routes/retro-games.ts`

---

## 🔤 字体修改

### 方法 1: 修改字体变量（推荐）

在 `:root` 部分修改：

```css
:root {
    /* 英文标题字体 */
    --font-main: 'Pixeloid Sans', 'Arial Black', 'Impact', sans-serif;
    
    /* 中文界面字体 */
    --font-ui: 'FZG CN', 'Microsoft YaHei', 'PingFang SC', sans-serif;
}
```

**常用字体示例**：

```css
/* 使用系统字体 */
--font-main: 'Arial Black', 'Impact', sans-serif;
--font-ui: 'Microsoft YaHei', 'SimHei', sans-serif;

/* 使用 Google Fonts */
--font-main: 'Press Start 2P', 'Arial Black', sans-serif;
--font-ui: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;

/* 使用其他自定义字体 */
--font-main: 'YourCustomFont', 'Arial Black', sans-serif;
--font-ui: 'YourChineseFont', 'Microsoft YaHei', sans-serif;
```

### 方法 2: 使用在线字体（Google Fonts）

1. 在 `<head>` 标签中添加：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

2. 然后修改 CSS 变量：
```css
--font-main: 'Press Start 2P', 'Arial Black', sans-serif;
```

### 方法 3: 替换自定义字体文件

如果您有其他字体文件（.woff2, .ttf, .otf），修改 `@font-face`：

```css
@font-face {
    font-family: 'Your Font Name';
    src: url('YOUR_FONT_URL_HERE') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

:root {
    --font-main: 'Your Font Name', 'Arial Black', sans-serif;
}
```

---

## 📏 字号修改

### 主要字号位置表

| 元素 | 当前大小 | CSS 选择器 | 建议范围 |
|------|----------|-----------|----------|
| **Hero 标题** | 48px | `.hero-title` | 36-64px |
| **Hero 副标题** | 36px | `.hero-subtitle` | 24-48px |
| **窗口标题** | 12px | `.window-title` | 10-14px |
| **地址栏** | 默认 | `.address-bar` | 12-16px |
| **章节标题** | 28px | `.section-header` | 20-36px |
| **表单标签** | 14px | `.form-label` | 12-16px |
| **表单输入** | 14px | `.form-input` | 12-16px |
| **主按钮** | 20px | `.btn-primary` | 16-24px |
| **小按钮** | 12px | `.btn-small` | 10-14px |
| **侧边栏按钮** | 默认 | `.sidebar-btn` | 12-16px |
| **Agent 卡片标题** | 14px | `.agent-card-header` | 12-16px |
| **项目名称** | 16px | `.project-info h3` | 14-20px |

---

## 🎯 具体修改示例

### 示例 1: 调整 Hero 区域字号

**位置**: `src/routes/main.ts` 中的 `.hero-title` 和 `.hero-subtitle`

**查找**:
```css
.hero-title {
    font-family: var(--font-main);
    font-size: 48px;  /* ← 修改这里 */
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
    font-size: 36px;  /* ← 修改这里 */
    color: var(--bg-beige);
    text-shadow: 2px 2px 0px var(--retro-black);
    -webkit-text-stroke: 1px var(--retro-black);
    position: relative;
    z-index: 1;
}
```

**修改为更大**:
```css
.hero-title {
    font-size: 64px;  /* 原来 48px，现在 64px */
}

.hero-subtitle {
    font-size: 48px;  /* 原来 36px，现在 48px */
}
```

**修改为更小**:
```css
.hero-title {
    font-size: 36px;  /* 原来 48px，现在 36px */
}

.hero-subtitle {
    font-size: 24px;  /* 原来 36px，现在 24px */
}
```

---

### 示例 2: 调整表单字号

**位置**: `src/routes/main.ts` 中的表单相关样式

**查找**:
```css
.form-label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;  /* ← 修改这里 */
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--retro-black);
    background: white;
    font-family: var(--font-ui);
    font-size: 14px;  /* ← 修改这里 */
}
```

**修改示例**:
```css
.form-label {
    font-size: 16px;  /* 更大，更易读 */
}

.form-input,
.form-select,
.form-textarea {
    font-size: 16px;  /* 更大的输入文字 */
}
```

---

### 示例 3: 调整按钮字号

**主要按钮** (创建项目按钮):
```css
.btn-primary {
    width: 100%;
    padding: 15px;
    background: var(--retro-pink);
    border: 3px solid var(--retro-black);
    box-shadow: 4px 4px 0px var(--retro-black);
    font-family: var(--font-main);
    font-size: 20px;  /* ← 修改这里 */
    font-weight: bold;
    cursor: pointer;
}
```

**侧边栏按钮**:
```css
.sidebar-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    border: 2px solid var(--border-color);
    box-shadow: 3px 3px 0px var(--border-color);
    font-weight: bold;
    cursor: pointer;
    background: var(--retro-green);
    font-size: 14px;  /* ← 添加这行来控制字号 */
}
```

---

### 示例 4: 统一调整所有字号

如果想要统一放大或缩小所有文字，可以修改 `body` 的字号：

```css
body {
    background-color: #222;
    font-family: var(--font-ui);
    padding: 20px;
    min-height: 100vh;
    font-size: 14px;  /* ← 添加基础字号 */
}

/* 然后其他元素使用相对单位 */
.section-header {
    font-size: 2em;  /* 相对于 body 的 2 倍 */
}

.form-label {
    font-size: 1em;  /* 相对于 body 的 1 倍 */
}

.btn-primary {
    font-size: 1.4em;  /* 相对于 body 的 1.4 倍 */
}
```

**使用相对单位的好处**：
- `em`: 相对于父元素字号
- `rem`: 相对于根元素（html）字号
- `%`: 相对于父元素字号的百分比

---

## 🔍 快速查找和替换

### 使用命令行批量修改

**查找所有字号**:
```bash
cd /home/user/webapp
grep -n "font-size:" src/routes/main.ts
```

**批量替换** (需谨慎):
```bash
# 示例：将所有 14px 替换为 16px
sed -i 's/font-size: 14px/font-size: 16px/g' src/routes/main.ts
```

---

## 📱 响应式字号设计

如果想要在不同屏幕尺寸下使用不同字号：

```css
/* 默认（桌面） */
.hero-title {
    font-size: 48px;
}

/* 平板 */
@media (max-width: 1200px) {
    .hero-title {
        font-size: 36px;
    }
}

/* 手机 */
@media (max-width: 768px) {
    .hero-title {
        font-size: 28px;
    }
}
```

---

## 🛠️ 修改步骤

### 完整流程：

1. **定位文件**:
   ```bash
   cd /home/user/webapp
   ```

2. **编辑文件**:
   ```bash
   # 使用您喜欢的编辑器
   nano src/routes/main.ts
   # 或
   vim src/routes/main.ts
   ```

3. **查找要修改的部分**:
   - 按 Ctrl+W (nano) 或 / (vim) 搜索关键词
   - 搜索 `font-size:` 或 `font-family:`

4. **修改数值**:
   - 修改 `font-size: 48px` 为您想要的大小
   - 修改 `font-family: 'Pixeloid Sans'` 为您想要的字体

5. **保存文件**:
   - nano: Ctrl+O, Enter, Ctrl+X
   - vim: Esc, :wq, Enter

6. **重新构建**:
   ```bash
   npm run build
   ```

7. **重启服务**:
   ```bash
   fuser -k 3000/tcp 2>/dev/null || true
   pm2 start ecosystem.config.cjs
   ```

8. **查看效果**:
   访问 http://localhost:3000

---

## 🎨 常见字号搭配建议

### 方案 1: 舒适阅读型
```css
body { font-size: 16px; }
.hero-title { font-size: 52px; }
.hero-subtitle { font-size: 32px; }
.section-header { font-size: 28px; }
.form-label { font-size: 15px; }
.form-input { font-size: 15px; }
.btn-primary { font-size: 18px; }
```

### 方案 2: 紧凑型
```css
body { font-size: 13px; }
.hero-title { font-size: 40px; }
.hero-subtitle { font-size: 28px; }
.section-header { font-size: 22px; }
.form-label { font-size: 13px; }
.form-input { font-size: 13px; }
.btn-primary { font-size: 16px; }
```

### 方案 3: 大字型（适合老年人）
```css
body { font-size: 18px; }
.hero-title { font-size: 60px; }
.hero-subtitle { font-size: 42px; }
.section-header { font-size: 32px; }
.form-label { font-size: 18px; }
.form-input { font-size: 18px; }
.btn-primary { font-size: 22px; }
```

---

## 🔗 相关资源

- **Google Fonts**: https://fonts.google.com/
- **字体预览工具**: https://www.fontspace.com/
- **中文字体**: https://www.100font.com/
- **CSS 字体属性**: https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family

---

## ❓ 常见问题

### Q1: 修改后字体没变化？
**A**: 需要重新构建项目：
```bash
cd /home/user/webapp
npm run build
pm2 restart game-generator
```

### Q2: 如何只修改标题字体，不改正文？
**A**: 只修改 `--font-main` 变量，保持 `--font-ui` 不变。

### Q3: 字体文件在哪里？
**A**: 在 `/home/user/webapp/public/fonts/` 目录。

### Q4: 如何添加新字体文件？
**A**: 
1. 将字体文件放到 `public/fonts/` 
2. 添加 `@font-face` 声明
3. 修改 CSS 变量引用新字体

### Q5: 修改后需要提交到 Git 吗？
**A**: 建议提交：
```bash
git add src/routes/main.ts
git commit -m "调整字体和字号"
git push origin main
```

---

**最后更新**: 2024-11-22
**适用版本**: v2.3.0+
