# Git King Design Specifications: The "Cupertino Industrial" Language

**Version:** 1.0.0
**Status:** Approved for Development
**Role:** Design System Truth

本文档定义了 Git King 项目的视觉与交互准则。所有开发工作必须严格遵循此文档中的 Token 定义与交互逻辑，以确保实现“企业级”的交付质量。

---

## 1. 核心设计语言 (Design Tokens)

我们将 GitHub 的**功能性色彩体系 (Functional Colors)** 融入 Apple 的**视觉容器 (Visual Containers)** 中。

### 1.1 色彩系统 (Color Palette)

不要使用硬编码的 Hex 值，使用以下语义化 Token。

#### **Semantic Colors (Light / Dark Mode)**

| Token Name | Description | Light Mode (Hex/RGBA) | Dark Mode (Hex/RGBA) |
| :--- | :--- | :--- | :--- |
| **`bg-canvas`** | 全局背景 | `#F5F5F7` (Apple Gray) | `#0D1117` (GitHub Dark) |
| **`bg-surface`** | 卡片/容器背景 | `#FFFFFF` | `#161B22` |
| **`bg-surface-glass`** | 毛玻璃浮层 | `rgba(255, 255, 255, 0.72)` | `rgba(22, 27, 34, 0.72)` |
| **`bg-active`** | 列表项选中/按压 | `#F3F4F6` | `#21262D` |
| **`text-primary`** | 主标题 | `#1D1D1F` (Off-Black) | `#F0F6FC` |
| **`text-secondary`** | 描述/次级文字 | `#86868B` | `#8B949E` |
| **`border-subtle`** | 极细分割线 | `rgba(0, 0, 0, 0.08)` | `rgba(240, 246, 252, 0.1)` |
| **`accent-primary`** | 品牌主色 (Action) | `#007AFF` (Apple Blue) | `#58A6FF` (GitHub Blue) |
| **`code-bg`** | 代码块背景 | `#F6F8FA` | `#0D1117` |

### 1.2 深度与质感 (Depth & Texture)

采用 iOS 层级理论：背景是平的，内容是悬浮的，模态是磨砂的。

* **Glassmorphism (毛玻璃预设):**
    * **CSS Class:** `.glass-panel`
    * **Properties:**
        ```css
        background: var(--bg-surface-glass);
        backdrop-filter: blur(20px) saturate(180%); /* iOS 标准模糊 */
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid var(--border-subtle);
        ```

* **Shadow Elevation (阴影层级):**
    * **Level 1 (Card):** `0px 1px 2px rgba(0, 0, 0, 0.04)` (极简，贴地)
    * **Level 2 (Hover/Dropdown):** `0px 4px 12px rgba(0, 0, 0, 0.08)`
    * **Level 3 (Modal/Command Palette):** `0px 20px 40px -10px rgba(0, 0, 0, 0.15)` (深邃感)

### 1.3 排版 (Typography)

优先使用系统字体栈，配合等宽字体强化“开发者工具”属性。

* **Font Family:**
    * **Sans:** ` -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif`
    * **Mono:** `"JetBrains Mono", "SF Mono", "Fira Code", monospace`
* **Scale:**
    * `Heading 1`: 24px / 700 / Tracking -0.5px
    * `Heading 2`: 18px / 600 / Tracking -0.3px
    * `Body`: 15px / 400 / Line-height 1.5
    * `Caption`: 13px / 500 / Color: `text-secondary`
    * `Code`: 13px / Mono / Ligatures Enabled

---

## 2. 布局系统 (Layout System)

解决布局散乱的核心在于**严格的约束**。

### 2.1 容器与网格 (Container & Grid)

* **Global Container (`max-w`):**
    * Mobile: `100%` (padding-x: 16px)
    * Tablet: `720px`
    * Desktop: `1024px` (居中，不要铺满 1920 屏幕，保持阅读视线集中)

* **Card Grid Strategy (Bento Box Style):**
    * 使用 CSS Grid 而非 Flexbox 来保证对齐。
    * **Code:**
        ```css
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); /* 最小卡片宽度 340px */
        gap: 20px; /* 统一间距 */
        ```

### 2.2 Z-Index 策略 (Layer Management)

防止搜索框被遮挡的绝对真理：

| Layer | Z-Index | Component Examples |
| :--- | :--- | :--- |
| **Toast** | `9999` | 全局通知 (Sonner) |
| **Cursor** | `9000` | 自定义跟随鼠标元素 (如有) |
| **Modal / Overlay** | `1300` | **Command Palette (Super Panel)**, Dialogs |
| **Sticky Header** | `1100` | 顶部导航栏 |
| **Dropdown** | `1000` | Select 菜单, Tooltips |
| **Content** | `1` | 普通页面内容 |

---

## 3. 组件交互规范 (Component Specs)

### 3.1 The Super Panel (Command+K)

这是应用的心脏，必须做到丝滑无感。

* **Trigger (触发):** `⌘K` 或点击搜索图标。
* **Entrance Animation (入场动画):**
    * `Opacity`: 0 -> 1
    * `Scale`: 0.96 -> 1.00 (微弱的放大效果，像气泡弹出)
    * `Duration`: 0.2s Ease-out
* **State Styling:**
    * **Input:** 无边框，大字号 (18px)，自动聚焦。
    * **Item:** `padding: 12px 16px`。
    * **Active Item:** 背景变为 `accent-primary` (Light Mode 下为蓝色，Dark Mode 下为深蓝)，文字变白。这是 iOS 选中态的标准。

* **Deep Linking Logic (搜索跳转逻辑 - 核心痛点修复):**
    当用户选中一个 "Scenario" (如：配置 Git 用户名) 时：
    1.  **Immediate Feedback:** 模态框**立即关闭** (不要等待)。
    2.  **Navigation:** 路由跳转至首页 (如果不在首页)。
    3.  **Scroll Calculation:** 计算目标卡片 DOM 元素的 `offsetTop`，减去 `HeaderHeight` (约 80px) + `20px` buffer。
    4.  **Smooth Scroll:** 执行 `window.scrollTo({ top: target, behavior: 'smooth' })`。
    5.  **Highlight Animation (高亮反馈):**
        * 目标卡片触发一次 "Flash" 动画（背景色闪烁黄色或蓝色高亮 1秒），告诉用户“我在这里”。

### 3.2 Scenario Card (场景卡片)

* **Default State:**
    * 显示标题、简短描述、难度标签 (Beginner/Expert)。
    * 阴影等级: Level 1。
* **Hover State:**
    * `transform: translateY(-2px)` (轻微上浮)。
    * 阴影等级: Level 2。
* **Active/Click State (Micro-interaction):**
    * `transform: scale(0.98)` (物理按压感)。
    * 持续时间: 0.1s。
* **Expanded View:**
    * 点击后卡片高度使用 `Auto` 动画展开 (使用 Framer Motion `layout` prop)。
    * 内部的代码步骤 (`Step 1, Step 2`) 依次淡入 (`staggerChildren`).

---

## 4. 动画与反馈 (Motion & Feedback)

拒绝线性动画 (Linear)，拥抱物理模拟。

### 4.1 物理手感 (Spring Physics)

所有交互动画（弹窗、侧边栏、卡片展开）必须使用 Spring 曲线。

* **Global Spring Config:**
    ```javascript
    const springTransition = {
      type: "spring",
      stiffness: 400, // 高刚度，响应快
      damping: 30,    // 适当阻尼，无回弹震荡
      mass: 1
    };
    ```

### 4.2 Loading States (骨架屏)

* 不要只用转圈圈 (Spinner)。内容区域加载时，使用 **Skeleton**。
* **Style:** 浅灰色背景，带有一个 45度角的流光扫过 (`shimmer` animation)。
* **Shape:** 圆角必须与真实组件一致 (如圆形头像、圆角矩形卡片)。

### 4.3 Error Handling (错误反馈)

* **Toast:** 使用 `sonner` 库。
    * **Position:** Bottom Center (移动端) / Bottom Right (桌面端)。
    * **Style:** 黑色背景，白色文字 (iOS Toast 风格)，带细微边框。
* **Haptic/Visual Shake:** 如果用户输入无效 Token，输入框应左右震动 (X轴位移 5px, 循环 3次)。

---

## 5. MUI v7 Theme Override Strategy

将此配置应用于 `src/config/theme.ts`，以覆盖 Material Design 的默认质感。

```typescript
import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // 需根据 Context 动态切换
    primary: { main: '#007AFF' }, // iOS Blue
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1D1F',
      secondary: '#86868B',
    },
  },
  typography: {
    fontFamily: '"SF Pro Text", "Inter", sans-serif',
    button: {
      textTransform: 'none', // 禁用全大写
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16, // 更大的圆角 (iOS 风格)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // 按钮圆角
          boxShadow: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: alpha('#007AFF', 0.08), // 细腻的 Hover
          },
        },
        contained: {
          '&:hover': {
             backgroundColor: '#0062CC', // 深蓝 Hover
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // 移除 Material 默认的 overlay
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.02)', // 自定义柔和阴影
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

export default theme;