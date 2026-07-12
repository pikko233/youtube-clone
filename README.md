<h1 align="center">
  <img src="public/logo.svg" alt="NewTube" width="40" />
  <br/>
  NewTube
</h1>

<p align="center">
  基于 <b>Next.js 16</b> 全栈构建的 YouTube 克隆视频分享平台
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00C2FF?logo=postgresql" alt="PostgreSQL" />
</p>

---

## ✨ 核心功能

### 🏠 视频浏览
- **首页** — 分类筛选 + 无限滚动视频推荐
- **热门** — 按观看量排序的热门视频
- **订阅推送** — 查看已订阅博主的最新视频
- **搜索** — 按标题模糊搜索，支持分类筛选

### 🎬 视频观看
- **Mux 播放器** — 专业级视频播放体验
- **视频反应** — 点赞/踩，实时统计
- **评论系统** — 发表评论、回复评论、评论点赞
- **相关推荐** — 根据当前视频分类智能推荐
- **观看记录** — 自动记录观看历史

### 👤 用户社交
- **Clerk 认证** — 安全的登录/注册（支持多平台）
- **个人主页** — 自定义头像、背景横幅
- **订阅博主** — 关注你喜欢的创作者
- **订阅管理** — 侧边栏快速访问 + 独立管理页面

### 📋 播放列表
- 创建/删除播放列表
- 向播放列表添加/移除视频
- **点赞视频** — 自动归入「已赞」播放列表
- **观看历史** — 按时间线查看

### 🎨 创作者工作台
- **视频上传** — 通过 Mux 上传，支持拖拽
- **视频管理** — 查看所有视频的播放量、评论、点赞
- **视频编辑** — 修改标题、描述、分类、可见性
- **自定义缩略图** — 上传或从视频帧提取

### 🤖 AI 驱动
- **AI 生成标题** — 基于视频字幕自动生成
- **AI 生成描述** — 智能摘要视频内容
- **AI 生成缩略图** — 通过 Gemini 图像生成

### 🎯 设计体验
- 响应式布局（移动端/平板/桌面）
- 亮色/暗色主题
- 中文本地化
- 骨架屏加载状态

---

## 🛠 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **框架** | Next.js 16 + React 19 | App Router, Server Components |
| **语言** | TypeScript 5 | 严格模式 |
| **样式** | Tailwind CSS 4 + shadcn/ui | radix-nova 风格 |
| **API 层** | tRPC v11 | 端到端类型安全 |
| **数据获取** | TanStack React Query v5 | 缓存 + 无限滚动 |
| **数据库** | PostgreSQL (Neon) + Drizzle ORM | Serverless, 类型安全 |
| **认证** | Clerk | 用户管理 + Webhook 同步 |
| **视频** | Mux | 上传、转码、播放、字幕 |
| **文件存储** | UploadThing | 图片/缩略图上传 |
| **缓存/限流** | Upstash Redis | 滑动窗口限流 |
| **后台任务** | Upstash QStash | AI 工作流异步执行 |
| **AI** | OpenRouter (GPT-4o / Gemini) | 标题/描述/缩略图生成 |
| **表单** | React Hook Form + Zod | 类型安全验证 |
| **图标** | Lucide React | SVG 图标库 |
| **通知** | Sonner | Toast 消息 |

---

## 📁 项目架构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/             #   认证路由组 (登录/注册)
│   ├── (home)/             #   主站路由组 (首页/搜索/视频/用户/播放列表/订阅)
│   ├── (studio)/           #   工作台路由组 (视频管理/上传)
│   └── api/                #   API 路由 (tRPC/Webhook/UploadThing)
│
├── modules/                # 领域模块（按功能划分）
│   ├── auth/               #   认证模块
│   ├── categories/         #   分类模块
│   ├── comments/           #   评论模块 (含评论反应)
│   ├── home/               #   首页模块 (导航栏/侧边栏/布局)
│   ├── playlists/          #   播放列表模块
│   ├── search/             #   搜索模块
│   ├── studio/             #   工作台模块 (上传/管理)
│   ├── subscriptions/      #   订阅模块
│   ├── suggestions/        #   推荐模块
│   ├── users/              #   用户模块
│   └── video/              #   视频模块 (播放器/反应/观看)
│       └── server/         #     tRPC 服务端过程
│       └── ui/             #     React 组件
│
├── components/             # 共享组件
│   └── ui/                 #   shadcn/ui 组件库 (~55 个)
│
├── db/                     # 数据库
│   ├── index.ts            #   Drizzle + Neon 连接
│   └── schema.ts           #   数据库表定义
│
├── trpc/                   # tRPC 配置
│   ├── init.ts             #   初始化 + 中间件 + 限流
│   ├── client.tsx          #   客户端 Provider
│   ├── server.tsx          #   服务端调用器
│   └── routers/_app.ts     #   路由合并入口
│
├── lib/                    # 基础设施库
│   ├── mux.ts              #   Mux 客户端
│   ├── uploadthing.ts      #   UploadThing 客户端
│   ├── ratelimit.ts        #   Upstash 限流
│   ├── redis.ts            #   Upstash Redis
│   ├── workflow.ts         #   Upstash 工作流
│   └── utils.ts            #   工具函数
│
├── hooks/                  # 自定义 Hooks
├── constants.ts            # 全局常量
├── proxy.ts                # Clerk 中间件
└── scripts/                # 脚本工具
```

### 数据流

```
浏览器 ──→ tRPC Client ──→ /api/trpc ──→ tRPC Router ──→ Drizzle ORM ──→ Neon PostgreSQL
    │                                      │
    │                                      ├── Upstash Redis (缓存/限流)
    │                                      ├── Clerk (认证)
    │                                      ├── Mux API (视频处理)
    │                                      ├── UploadThing (文件存储)
    │                                      └── QStash (AI 工作流)
    │
    └── React Query (缓存/水合)
```

---

## 🗄 数据库模型

```
users ──┬── videos ──┬── video_views
        │            ├── video_reactions
        │            ├── comments ──┬── comment_reactions
        │            │             └── comments (父评论)
        │            └── playlist_videos
        │
        ├── subscriptions (viewer → creator)
        ├── playlists ── playlist_videos
        └── video_reactions / video_views / comment_reactions
              
categories ── videos
```

| 表 | 说明 |
|----|------|
| `users` | 用户信息（Clerk 同步） |
| `videos` | 视频（关联 Mux 资产） |
| `categories` | 视频分类 |
| `comments` | 评论（支持自引用嵌套回复） |
| `comment_reactions` | 评论反应（赞/踩） |
| `video_reactions` | 视频反应（赞/踩） |
| `video_views` | 观看记录 |
| `subscriptions` | 用户订阅关系 |
| `playlists` | 播放列表 |
| `playlist_videos` | 播放列表-视频关联 |

---

## 🚀 快速开始

### 环境要求

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 20
- PostgreSQL 数据库（推荐 [Neon](https://neon.tech)）
- 以下第三方服务的账号和 API 密钥

### 1. 克隆项目

```bash
git clone <repo-url>
cd youtube-clone
```

### 2. 安装依赖

```bash
bun install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，填写以下关键配置：

| 变量 | 服务 | 获取地址 |
|------|------|---------|
| `DATABASE_URL` | Neon PostgreSQL | [neon.tech](https://neon.tech) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | [clerk.com](https://clerk.com) |
| `CLERK_SECRET_KEY` | Clerk | [clerk.com](https://clerk.com) |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Clerk Webhook | [clerk.com](https://clerk.com) |
| `MUX_TOKEN_ID` | Mux | [mux.com](https://mux.com) |
| `MUX_TOKEN_SECRET` | Mux | [mux.com](https://mux.com) |
| `MUX_WEBHOOK_SECRET` | Mux Webhook | [mux.com](https://mux.com) |
| `UPLOADTHING_TOKEN` | UploadThing | [uploadthing.com](https://uploadthing.com) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis | [upstash.com](https://upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis | [upstash.com](https://upstash.com) |
| `QSTASH_URL` | Upstash QStash | [upstash.com](https://upstash.com) |
| `QSTASH_TOKEN` | Upstash QStash | [upstash.com](https://upstash.com) |
| `OPENROUTER_API_KEY` | OpenRouter (AI) | [openrouter.ai](https://openrouter.ai) |

### 4. 数据库迁移

```bash
# 生成迁移文件
bunx drizzle-kit generate

# 执行迁移
bunx drizzle-kit migrate
```

### 5. 初始化种子数据

```bash
bun run src/scripts/seed-categories.ts
```

### 6. 启动开发服务器

```bash
bun run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

---

## 🧪 开发指南

### Webhook 本地测试

项目依赖多个 Webhook（Clerk、Mux、QStash），本地开发需要 ngrok 暴露公网地址：

```bash
# 同时启动 Next.js + ngrok
bun run dev:all

# 或分别启动
bun run dev              # 终端 1: Next.js
bun run dev:webhook      # 终端 2: ngrok
```

将 ngrok URL 配置到各服务的 Webhook 回調地址。

### 代码规范

```bash
bun run lint
```

- ESLint 9 + `eslint-config-next` (core-web-vitals + TypeScript)
- TypeScript 严格模式

### 常用命令

```bash
bun run dev          # 开发模式
bun run build        # 生产构建
bun run start        # 运行生产版本
bun run lint         # 代码检查
bunx drizzle-kit studio  # 数据库可视化管理
```

---

## 📄 路由一览

| 路径 | 说明 | 权限 |
|------|------|------|
| `/` | 首页视频流 | 公开 |
| `/feed/trending` | 热门视频 | 公开 |
| `/feed/subscribed` | 订阅推送 | 需登录 |
| `/search?query=` | 搜索 | 公开 |
| `/videos/[id]` | 视频详情 | 公开 |
| `/users/[id]` | 用户主页 | 公开 |
| `/playlists` | 播放列表 | 需登录 |
| `/playlists/[id]` | 播放列表详情 | 公开 |
| `/playlists/liked` | 已赞视频 | 需登录 |
| `/playlists/history` | 观看历史 | 需登录 |
| `/subscriptions` | 订阅管理 | 需登录 |
| `/studio` | 创作者工作台 | 需登录 |
| `/studio/videos/[id]` | 视频编辑 | 需登录 |
| `/sign-in` | 登录 | 公开 |
| `/sign-up` | 注册 | 公开 |

---

## 📝 许可

MIT License

---

<p align="center">
  Built with ❤️ using Next.js + tRPC + Drizzle + Clerk + Mux
</p>
