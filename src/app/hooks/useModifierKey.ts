import { useState, useEffect } from 'react';

/**
 * 监听修饰键按下状态，用于 "Modifier Peek" 交互（见 specs/interaction.md）。
 * 兼容 Mac (Meta/Command) 与 Windows (Control)。
 */
export function useModifierKey(key: string = 'Control'): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
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
}
