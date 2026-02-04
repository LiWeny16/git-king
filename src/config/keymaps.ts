// Keyboard shortcuts configuration for Git King

export interface KeyBinding {
  key: string;
  code: string;
  modifiers: {
    ctrl?: boolean;
    meta?: boolean;  // Command key on Mac
    alt?: boolean;
    shift?: boolean;
  };
  description: string;
  action: string;
}

// Detect if running on macOS
export const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// Key bindings configuration
export const KEY_BINDINGS: Record<string, KeyBinding> = {
  OPEN_COMMAND_PALETTE: {
    key: 'k',
    code: 'KeyK',
    modifiers: {
      [isMac ? 'meta' : 'ctrl']: true,
    },
    description: isMac ? '⌘K' : 'Ctrl+K',
    action: 'openCommandPalette',
  },
  SEARCH: {
    key: '/',
    code: 'Slash',
    modifiers: {},
    description: '/',
    action: 'focusSearch',
  },
  ESCAPE: {
    key: 'Escape',
    code: 'Escape',
    modifiers: {},
    description: 'Esc',
    action: 'closePanel',
  },
  NAVIGATE_UP: {
    key: 'ArrowUp',
    code: 'ArrowUp',
    modifiers: {},
    description: '↑',
    action: 'navigateUp',
  },
  NAVIGATE_DOWN: {
    key: 'ArrowDown',
    code: 'ArrowDown',
    modifiers: {},
    description: '↓',
    action: 'navigateDown',
  },
  SELECT: {
    key: 'Enter',
    code: 'Enter',
    modifiers: {},
    description: '↵',
    action: 'select',
  },
  COPY: {
    key: 'c',
    code: 'KeyC',
    modifiers: {
      [isMac ? 'meta' : 'ctrl']: true,
    },
    description: isMac ? '⌘C' : 'Ctrl+C',
    action: 'copy',
  },
};

// Helper function to check if a keyboard event matches a key binding
export function matchesKeyBinding(event: KeyboardEvent, binding: KeyBinding): boolean {
  const modifiersMatch = 
    (!!binding.modifiers.ctrl === event.ctrlKey) &&
    (!!binding.modifiers.meta === event.metaKey) &&
    (!!binding.modifiers.alt === event.altKey) &&
    (!!binding.modifiers.shift === event.shiftKey);

  return modifiersMatch && (event.code === binding.code || event.key === binding.key);
}

// Get display text for a key binding
export function getKeyBindingDisplay(bindingKey: keyof typeof KEY_BINDINGS): string {
  return KEY_BINDINGS[bindingKey]?.description || '';
}
