# sqking-coke Homepage
这是一个轻量化、响应式的个人主页网站，支持暗黑/亮色主题切换、多语言切换，包含项目展示、开源贡献、时间线、技术栈、联系方式等核心模块。
CSS由vibecoding实现。

> 原项目地址：https://github.com/Lain-Ego0/Lain-Ego0.github.io
> 魔改内容：添加后台管理

## 目录
- [源码构成](#源码构成)
- [环境要求](#环境要求)
- [使用指南](#使用指南)
- [目录结构详解](#目录结构详解)
- [核心功能说明](#核心功能说明)
- [自定义配置](#自定义配置)

## 源码构成
本项目为纯前端静态网站，数据与代码分离，无后端依赖。

### 1. 数据层（data/*.json）
所有动态内容从 JSON 文件加载，修改内容无需改代码：
- `data/projects.json` — 项目列表（图片、标题key、标签、详情页链接）
- `data/opensource.json` — 开源贡献列表（i18n key、代码/文档链接）
- `data/timeline.json` — 时间线事件顺序列表（i18n key 数组）
- `data/skills.json` — 技术栈分类及条目（名称、图标）
- `data/contact.json` — 社交联系方式（图标、i18n key、链接）

### 2. 国际化（lang/*.json）
- `lang/zh.json` — 中文文案（所有页面文本）
- `lang/en.json` — 英文文案

### 3. 核心 HTML（index.html）
网站骨架，包含导航栏、各板块容器、页脚。内容全部通过 JS 动态渲染。

### 4. CSS 样式（assets/css/style.css）
- 响应式布局（适配移动端/桌面端）
- 主题样式（light/dark 两套主题变量，CSS 变量驱动）
- 组件样式（导航栏、头像、卡片、标签、时间线等）
- 入场动效（IntersectionObserver + CSS transition）

### 5. JavaScript
#### (1) 国际化（assets/js/i18n.js）
- 多语言切换，基于 `data-i18n` 属性匹配文案
- fetch 加载 `lang/*.json`，切换时重新渲染

#### (2) 核心渲染（assets/js/main.js）
- fetch 加载 `data/*.json` → 动态渲染所有板块
- 主题切换（`data-theme` 属性 + localStorage）
- 平滑滚动、IntersectionObserver 入场动效

### 6. 后台管理（admin.html）
浏览器端管理面板，支持在线编辑内容并一键发布到 GitHub：
- 无需后端服务，直接通过 GitHub API 读写仓库文件
- 支持离线预览（本地 fetch JSON 直接编辑）
- 管理范围：项目、开源、时间线、技能、联系方式、中英文文案

## 环境要求
无需复杂环境，满足以下任一条件即可运行：
- 现代浏览器（Chrome/Firefox/Safari/Edge 最新版）
- 静态文件服务器（如 Nginx、Live Server 插件、Python SimpleHTTPServer）
- GitHub Pages/Gitee Pages 等静态页面托管平台

## 使用指南
### 1. 源码拉取
```bash
# 克隆仓库
git clone https://github.com/sqking-coke/sqking-coke.github.io.git
cd sqking-coke.github.io
```

### 2. 本地运行
#### 方式1：直接打开（简单测试）
双击 `index.html` 文件，通过浏览器直接打开（部分交互可能因跨域/本地路径问题受限）。

#### 方式2：静态服务器运行（推荐）
```bash
# 方法1：使用 Python 3 启动简易服务器
python -m http.server 8080

# 方法2：使用 Node.js http-server（需先安装：npm install -g http-server）
http-server -p 8080

# 方法3：VS Code 安装 Live Server 插件，右键 index.html → "Open with Live Server"
```
访问地址：`http://localhost:8080`

### 3. 部署上线
#### 方式1：GitHub Pages（推荐）
1. 将代码推送到 GitHub 仓库（仓库名：`[用户名].github.io`）；
2. 进入仓库 → Settings → Pages → 选择 `main` 分支 → 保存；
3. 等待几分钟后，访问 `https://[用户名].github.io` 即可。

#### 方式2：自定义服务器（Nginx）
1. 将源码上传到服务器；
2. 配置 Nginx 指向源码目录：
```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为你的域名
    root /path/to/sqking-coke.github.io; # 替换为源码路径
    index index.html;

    # 支持 SPA 路由（如需）
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
3. 重启 Nginx：`nginx -s reload`。

## 目录结构详解
```
sqking-coke.github.io/
├── index.html               # 核心HTML页面（网站入口）
├── admin.html               # 后台管理面板（浏览器端 CMS）
├── data/                    # 数据层（JSON，可后台编辑）
│   ├── projects.json        # 项目列表
│   ├── opensource.json      # 开源贡献
│   ├── timeline.json        # 时间线事件顺序
│   ├── skills.json          # 技术栈
│   └── contact.json         # 联系方式
├── lang/                    # 国际化文案
│   ├── zh.json              # 中文
│   └── en.json              # 英文
├── pages/                   # 子页面
│   └── projects/            # 项目详情页
├── assets/                  # 静态资源目录
│   ├── css/
│   │   └── style.css        # 全局样式（含主题、布局、组件样式）
│   ├── js/
│   │   ├── i18n.js          # 多语言切换逻辑
│   │   └── main.js          # 数据加载 + 核心渲染
│   └── images/              # 图片目录
└── README.md
```

## 后台管理（admin.html）

### 快速开始
1. 启动本地服务：`python -m http.server 8080`
2. 浏览器打开 `http://localhost:8080/admin.html`

### 离线模式（本地编辑预览）
直接打开 admin.html 即可自动加载本地 JSON 数据，编辑后效果立即可见。适合本地调试。

### 在线模式（发布到 GitHub）
适合直接更新线上站点内容，无需手动 git 操作：

1. 创建 GitHub Personal Access Token（Settings → Developer settings → Tokens (classic)），勾选 `repo` 权限
2. 在 admin 页面顶部填写 Token、Owner（如 `sqking-coke`）、Repo（如 `sqking-coke.github.io`）、Branch（`main`）
3. 点击「加载数据」从 GitHub 拉取最新文件
4. 在各 Tab 中编辑内容（增/删/改/排序）
5. 点击「发布到 GitHub」一键提交所有变更
6. GitHub Pages 会自动部署更新

### 管理范围
| 模块 | 说明 |
|------|------|
| 项目 | 标题/描述/图片/标签/详情链接，支持排序 |
| 开源 | i18n key/代码链接/文档链接，支持排序 |
| 时间线 | 事件 key 列表，控制展示顺序和增删 |
| 技能 | 分类和条目（名称+图标） |
| 联系方式 | 图标/i18n key/链接 |
| 中文/英文文案 | 直接编辑完整 JSON，实时生效 |

### 安全提示
- Token 仅存储在浏览器 localStorage 中，不会上传到第三方
- 建议使用 Classic Token 并设置合适的过期时间
- 每次发布会产生一条 commit 记录，便于回溯

---

## 主题切换
- 初始化：读取 localStorage 中的主题偏好，无则匹配系统深色/亮色模式
- 点击导航栏「月亮/太阳」图标切换，偏好持久化到 localStorage

## 多语言切换
- 点击导航栏「中文/English」按钮切换
- 文案位于 `lang/zh.json` 和 `lang/en.json`，可通过 admin 面板编辑

## 自定义主题
- 修改 `assets/css/style.css` 中的 `:root`（light 主题）和 `[data-theme="dark"]`（dark 主题）下的 CSS 变量