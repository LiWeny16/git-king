# Git King Interaction & Metaphors: The "Soul" of the UI

**Version:** 1.0.0
**Type:** Behavioral Specifications
**Dependency:** `specs/UI-UX.md` (for visual tokens)

本文档定义了 Git King 的核心交互隐喻与行为逻辑。如果说 `UI-UX.md` 决定了应用“长什么样”，本文档则决定了应用“怎么动”以及它“感觉像什么”。

所有前端实现（React Hooks, Framer Motion, CSS Pseudo-elements）必须严格遵循以下规范。

---

## 1. 视觉隐喻系统: "The Flow Connector" (流程连接器)

**Context:**
用户执行 Git 操作往往不是孤立的动作，而是一连串有序的步骤（如：Add -> Commit -> Push）。目前的 UI 将它们展示为孤立卡片，切断了这种心智模型。

**Metaphor Definition:**
* **The Assembly Line (装配流水线):** 场景 (Scenario) 中的每一个原子命令 (Command) 都是流水线上的一环。
* **The Data Pipe (数据管道):** 卡片之间的连接线不仅仅是装饰，它象征着 Git 数据流（Data Stream）的传递。

### 1.1 Visual Specifications (视觉规范)

* **Connector Line (管道线):**
    * **位置:** 连接上一个卡片的底部中心与下一个卡片的顶部中心。
    * **宽度:** `2px`。
    * **颜色:** `var(--border-subtle)` (确保视觉上不抢眼，但清晰可见)。
    * **长度:** 必须完全跨越卡片之间的 `gap` (通常为 16px 或 20px)。
* **Directional Indicator (流向指示):**
    * 在连接线的最末端（接触下一张卡片的地方），必须绘制一个 **Arrowhead (`↓`)** 或 **Dot**。
    * **推荐:** 使用实心小圆点 (6px diameter) 或微型箭头，象征“节点锁止”。

### 1.2 Implementation Strategy (技术实现思路)

不要使用额外的 DOM 元素绘制线条，使用 CSS 伪元素以保持 DOM 树整洁。

```scss
/* SCSS / CSS Module Logic */

.workflow-container {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 卡片间距 */
}

.command-card-wrapper {
  position: relative;
  width: 100%;
  
  /* 核心逻辑：除了最后一个元素，其他所有元素都画一条向下的线 */
  &:not(:last-of-type)::after {
    content: '';
    position: absolute;
    
    /* 定位逻辑 */
    left: 50%; /* 居中 */
    bottom: -24px; /* 延伸到 gap 区域 */
    width: 2px;
    height: 24px; /* 填满 gap */
    
    /* 样式 */
    background-color: var(--border-subtle);
    transform: translateX(-50%);
    z-index: 0; 
  }

  /* 可选：箭头/节点装饰 (位于线条底部) */
  &:not(:last-of-type)::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -28px; /* 稍微超出一点，或是贴合下一张卡片顶部 */
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--text-secondary); /* 或使用 accent 色 */
    transform: translateX(-50%);
    z-index: 1;
  }
}

```

---

## 2. 高级交互模式: "The Modifier Peek" (修饰键窥视)

**Context:**
这是解决“极简主义”与“信息密度”矛盾的核心方案。我们要像 IDE (VS Code) 一样，仅在用户显式请求时提供深度上下文。

**Design Goal:**

* **Default (默认):** "Clean & Actionable" —— 只看代码，快速复制。
* **Peek (窥视):** "Educational & Deep" —— 解释原理，参数含义。

### 2.1 Interaction Logic (交互状态机)

系统需维护一个复合状态机：

| State | Trigger Conditions | UI Behavior |
| --- | --- | --- |
| **Idle** | `!Hover` | 显示命令代码；隐藏解释；隐藏提示。 |
| **Hover Ready** | `Hover` + `!Ctrl` | 卡片上浮 (Scale 1.01)；**右下角显示 "Hold Ctrl to explain"**。 |
| **Peeking** | `Hover` + `Ctrl` | **展开解释面板**；隐藏提示文字；光标变为 `help` 或 `context-menu`。 |

### 2.2 Visual Feedback (视觉反馈细节)

1. **Cursor Hint (提示):**
* 这必须极度克制。使用 `10px` 或 `11px` 的字体，颜色 `text-tertiary` (浅灰)，出现在卡片右下角或右上角。
* 当进入 `Peeking` 状态时，提示文字应立即消失 (Opacity -> 0)。


2. **Expansion Animation (展开动画):**
* 解释面板不应突兀出现，必须使用 **Height Animation**。
* **背景色隐喻:** 解释区域是“卡片的背面”或“注释层”，背景色应使用 `bg-canvas` (略深于卡片) 或带有微弱的黄色高亮 (`rgba(255, 255, 0, 0.05)` - 模拟便签)。



### 2.3 Technical Specs (技术规范)

#### A. Custom Hook: `useModifierKey`

必须在全局实现键盘监听，确保响应无延迟。

```typescript
// src/hooks/useModifierKey.ts
import { useState, useEffect } from 'react';

export const useModifierKey = (key: string = 'Control') => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      // 兼容 Mac (Meta/Command) 和 Windows (Control)
      if (e.key === key || (key === 'Control' && e.key === 'Meta')) {
        setIsPressed(true);
      }
    };
    
    const handleUp = (e: KeyboardEvent) => {
      if (e.key === key || (key === 'Control' && e.key === 'Meta')) {
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [key]);

  return isPressed;
};

```

#### B. Component Logic (React + Framer Motion)

```tsx
// src/components/feature/CommandCard.tsx (Pseudo-code)

const CommandCard = ({ command, explanation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCtrlPressed = useModifierKey('Control');
  
  // 核心逻辑：只有在 Hover 且按住 Ctrl 时才为 True
  const isPeeking = isHovered && isCtrlPressed;

  return (
    <div 
      className="command-card-wrapper relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content bg-surface p-4 rounded-xl border border-border-subtle shadow-sm transition-transform hover:scale-[1.01]">
        {/* 代码区域 */}
        <code className="font-mono text-sm">{command}</code>
        
        {/* Hint Text (仅在 Hover 但未展开时显示) */}
        {isHovered && !isPeeking && (
          <span className="absolute bottom-2 right-4 text-[10px] text-text-tertiary animate-fade-in">
            Hold Ctrl to explain
          </span>
        )}
      </div>

      {/* 解释面板 (Peeking Layer) */}
      <AnimatePresence>
        {isPeeking && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 30 } // iOS Physics
            }}
            exit={{ height: 0, opacity: 0 }}
            className="explanation-panel overflow-hidden bg-canvas mx-2 rounded-b-lg border-x border-b border-border-subtle"
          >
            <div className="p-3 text-xs text-text-secondary markdown-body">
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


---

## 3. Mobile Adaptation Strategy (移动端降级策略)

由于移动端没有 `Hover` 和 `Ctrl` 键，必须提供降级交互。

* **Logic:** 检测到 Touch 设备时，禁用 `Modifier Peek` 逻辑。
* **Fallback:** 在卡片右上角添加一个显式的 `(i)` 或 `?` 图标按钮。
* **Behavior:** 点击按钮 -> 切换展开/折叠解释面板 (Toggle)。

```typescript
const isTouch = useMediaQuery('(pointer: coarse)');
// 移动端直接点击切换，桌面端用 Ctrl 逻辑
const showExplanation = isTouch ? isToggled : (isHovered && isCtrlPressed);

```
