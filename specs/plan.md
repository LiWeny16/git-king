### 1. 最终极物理蓝图 (Directory Structure)

```text
git-king/
├── docs/                   # [Build] Github Pages 输出目录
├── public/                 # Favicon, Manifest
├── specs/
│   └── plan.md             # [总指挥书] 最终定稿版 v4.0
├── src/
│   ├── app/                # [核心逻辑层]
│   │   ├── constants/      # 静态常量
│   │   ├── data/           # [数据源]
│   │   │   ├── commands.ts # 原子命令定义
│   │   │   └── workflows.ts# 场景工作流
│   │   ├── utils/          # [工具库] 
│   │   │   ├── clipboard.ts
│   │   │   ├── search.ts   # Fuse.js 配置
│   │   │   └── shortcuts.ts# [NEW] 键盘快捷键监听 (Cmd+K)
│   │   ├── hooks/          # useAI (stream), useOptimisticGit
│   ├── components/         # [UI 组件层]
│   │   ├── common/         # 通用组件
│   │   │   ├── Markdown/   # [NEW] AI 消息渲染器 (GitHub Style)
│   │   │   └── Command/    # [NEW] cmdk 指令面板组件
│   │   ├── visuals/        # 可视化组件
│   │   │   └── FlowGraph/  # [NEW] React Flow 流程图容器
│   │   ├── feature/        # 功能组件
│   │   │   ├── AIChat/     # [NEW] 生成式 UI 容器 (Streaming)
│   │   │   └── RepoList/   # 虚拟化列表
│   │   └── layout/         # [NEW] 全局布局 (含 Toaster)
│   ├── config/             # [配置中心]
│   │   ├── theme.ts        # iOS Style (MUI v7 Custom)
│   │   └── keymaps.ts      # [NEW] 快捷键定义
│   ├── services/           # [服务层]
│   │   ├── ai/             # AI 服务 (Stream & Function Calling)
│   │   └── git/            # Git 模拟与执行
│   ├── store/              # [MobX + Persistence]
│   │   ├── uiStore.ts      # UI 状态 (Modal Open/Close)
│   │   ├── gitStore.ts     # 持久化 Repo/Token
│   │   └── variableStore.ts# 持久化表单数据
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口
└── package.json

```

---

### 2. 最终极施工计划书 (specs/plan.md)

**请将以下内容保存为 `specs/plan.md`，这是集成了 iOS 风格、Command K、React Flow 与生成式 AI 的终极方案。**

# Project Plan: Git King (The Intelligent iOS-Style Git Console)

这是根据你的最新需求重新定义的**项目愿景 (Vision)** 部分。核心定位从“重型驾驶舱”转向了**“智能场景速查库”**，并明确了 **Super Panel (超级面板)** 的混合搜索逻辑。

请将 `specs/plan.md` 中的 `## 1. 项目愿景 (Vision)` 替换为以下内容：

---

## 1. 项目愿景 (Vision)

构建一个**iOS 风格、场景化驱动、混合智能**的 Git 速查与工作流工具。

* **定位**: 你的 **Git 智能副驾驶 (Smart Copilot)** —— 平时是极速速查字典，关键时刻是 AI 参谋。
* **核心理念**: **Scenario (场景) > Command (指令)**。用户遇到问题时（如“代码推错了”），首先想到的是**场景**，而不是具体的 `git reset` 参数。

### 核心体验 (Core Experience)

1. **Scenario-Based Workflow (场景化工作流)**:
* **概念映射**: 将 Git 操作划分为 **"Scenario (场景)"** 与 **"Atomic Command (原子指令)"**。
* **交互**: 首页展示常见场景卡片（如“✨ 创建新功能分支”、“🚑 撤销最近提交”）。
* **详情**: 点击场景卡片，展开其背后的**原子指令序列**。
* *例 "新建分支"*: 自动展开 `git checkout -b {branch}` -> `git add .` -> `git push -u origin {branch}` 的完整序列，支持一键分步复制。




2. **Hybrid Super Panel (混合智能超级面板)**:
* **双入口同步**: 无论点击右上角的搜索图标，还是按下 `⌘K`，唤起同一个**Super Panel**，内容与状态完全同步，自动聚焦输入框。
* **无 Token 模式 (极速模式)**: 默认状态。使用 **Fuse.js** 对本地内置的 50+ 个常见场景和 100+ 个原子指令进行毫秒级模糊搜索。
* **Token 模式 (AI 增强模式)**: 当用户配置 Token 后，面板升级。如果本地搜索无结果，自动转交给 AI 处理，生成定制化的场景解释和指令。


3. **Visual Cheatsheet (可视化速查)**:
* 摒弃枯燥的文档列表，用 iOS 风格的 **Grouped Lists** 展示指令。
* **关键场景覆盖**:
* **初始化 (Onboarding)**: 登录/配置 User & Email、Clone 仓库、关联远程库。
* **分支管理 (Branching)**: 新建/切换/删除分支、同步上游 (Fetch Upstream)。
* **提交与同步 (Sync)**: 暂存 (Stash)、常规提交、强制推送 (Force Push)。
* **后悔药 (Undo)**: 修改 Commit Message、撤销 Commit (Soft/Hard reset)、回滚文件。
* **冲突与合并 (Merge)**: Merge、Rebase、Cherry-pick。




4. **iOS Aesthetics**:
* 坚持使用 MUI v7 定制，还原 iOS 设置页面的**顺滑阻尼感**、**毛玻璃背景**和**层级导航**体验。



---

**（附：建议在 data/workflows.ts 中预置的场景清单，不需要写入 plan.md，但供你参考）**

* **Setup**: "首次配置 Git 用户名/邮箱", "生成 SSH Key", "克隆私有仓库"
* **Start**: "开始新的一天 (Pull & Rebase)", "新建功能分支"
* **WIP**: "临时去修别的一个 Bug (Stash)", "恢复刚才的工作 (Stash Pop)"
* **Finish**: "提交代码并推送", "合并分支到主干"
* **Fix**: "刚才提交的信息写错了 (Amend)", "彻底放弃本地修改 (Reset Hard)", "回退到上个版本但保留代码 (Reset Soft)"

## 2. 技术栈 (Tech Stack)

* **Core**: React 18 + TypeScript + Vite.
* **UI System**:
* **MUI v7**: 深度定制 Theme (iOS Design Tokens)。
* **Framer Motion**: 页面转场与微交互 (Micro-interactions)。
* **cmdk**: 实现高性能、可组合的 Command Palette。
* **@xyflow/react (React Flow)**: 节点式 Git 原理可视化。


* **Data & State**:
* MobX + `mobx-persist-store` (状态持久化)。
* `react-window` (长列表性能优化)。
* `fuse.js` (前端模糊搜索)。


* **AI & Content**:
* Fetch API (ReadableStream) for Streaming.
* `react-markdown` + `rehype-highlight` + `github-markdown-css` (GitHub 风格代码渲染)。



## 3. 详细架构规范 (Architecture Specs)

### 3.1 核心交互：Command Center (cmdk)

* **入口**: 全局监听 `Cmd+K` (Mac) / `Ctrl+K` (Win)。
* **功能**:
* 快速导航 (Go to Repo...)
* 快速动作 (Git Fetch, Git Checkout...)
* 唤起 AI (Ask AI...)


* **数据源**: 实时聚合 `fuse.js` 的搜索结果与 `commands.ts` 的静态命令。

### 3.2 AI 服务：Streaming & Generative UI

* **流式响应**: 实现 `useAIStream` Hook，处理 text chunk，并在 UI 上呈现光标闪烁效果 (Blinking Cursor)。
* **结构化输出**: AI 除了返回 Markdown 解释外，需能返回 JSON 指令块，前端解析为 **Action Card**（例如渲染一个“立即合并”按钮）。
* *Prompt 策略*: 要求 AI 在 Markdown 中嵌入特定语法（如 `:::action{type="merge", source="dev"}:::`) 供前端解析渲染。



### 3.3 可视化升级：React Flow

* **组件**: `components/visuals/FlowGraph`
* **用法**: 用 React Flow 的 Node/Edge 结构描述 Git 树。
* **场景**:
* 展示 Rebase 前后的 Commit 链变化。
* 交互式 Cherry-pick（拖拽节点）。



### 3.4 状态反馈：Optimistic UI

* **策略**: 在调用异步 API (如 `git fetch`) 之前，先立即更新 UI Store 的状态（如显示“已更新”），若失败则回滚并 Toast 报错。
* **组件**: 使用 `sonner` 或 MUI `Snackbar` 提供极其丝滑的 Toast 通知。

## 4. 开发阶段规划 (Development Phases)

### Phase 1: 基础设施与 iOS 主题 (Infra & Theme)

1. **Init**: Vite + React + TS。
2. **UI Base**:
* 配置 MUI v7 Theme，覆盖默认样式为 **iOS 风格** (System Fonts, Large Titles, Backdrop Blur)。
* 安装 `cmdk`, `@xyflow/react`, `mobx-persist-store`。


3. **i18n**: 完成中英基础配置。

### Phase 2: 核心数据与指令中枢 (Data & Command K)

1. **Store**: 实现 `VariableStore` (Persistent) 和 `GitStore`。
2. **Command Palette**:
* 集成 `cmdk`。
* 实现全局快捷键监听。
* 联通 `fuse.js` 实现仓库/命令的模糊搜索。



### Phase 3: 可视化与高性能列表 (Visuals & Perf)

1. **React Flow 集成**: 开发 `GitGraphNode` 自定义节点，用于绘制 Commit 和 Branch。
2. **RepoList**: 使用 `react-window` 实现虚拟滚动列表，并应用 iOS 风格的列表项样式 (Inset Grouped List)。

### Phase 4: AI 智能体与生成式 UI (AI & GenUI)

1. **Streaming Service**: 封装支持 Stream 的 Fetch 适配器。
2. **AI Chat Component**:
* 实现打字机效果 + 闪烁光标。
* **Markdown 渲染**: 引入 `github-markdown-css` 确保代码块高亮美观。
* **Action Parsing**: 解析 AI 文本中的指令，渲染为“一键执行”按钮。

### Phase 5: 细节打磨与乐观 UI (Polish)

1. **Micro-interactions**: 为按钮点击、列表 Hover 增加 Framer Motion 缩放/弹簧效果。
2. **Optimistic Feedback**: 改造核心 Git 操作，增加乐观更新逻辑。
3. **Build**: 最终构建与 GitHub Pages 部署测试。
4. **响应式布局**: 优化手机端/平板/PC端UI布局和UX体验，响应式Flex布局！

### Phase 6：代码规范
1. css不要单独写在css文件，尽量和组件一起复合，组件内一些配置常量可以写在顶层方便修改
2. 企业级代码规范要求！