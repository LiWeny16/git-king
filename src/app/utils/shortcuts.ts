// Global keyboard shortcut listener and handler
import { useEffect, useCallback } from 'react';
import { KEY_BINDINGS, matchesKeyBinding } from '../../config/keymaps';
import type { KeyBinding } from '../../config/keymaps';

// Shortcut action handler type
export type ShortcutHandler = () => void;

// Shortcut registry
const shortcutHandlers = new Map<string, ShortcutHandler>();

/**
 * Register a global keyboard shortcut
 */
export function registerShortcut(action: string, handler: ShortcutHandler): void {
  shortcutHandlers.set(action, handler);
}

/**
 * Unregister a keyboard shortcut
 */
export function unregisterShortcut(action: string): void {
  shortcutHandlers.delete(action);
}

/**
 * Handle keyboard events and trigger registered shortcuts
 */
function handleKeyboardEvent(event: KeyboardEvent): void {
  // Don't trigger shortcuts when typing in input fields
  const target = event.target as HTMLElement;
  const isInputField =
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable;

  // Allow Escape key even in input fields
  if (isInputField && event.key !== 'Escape') {
    return;
  }

  // Check each registered key binding
  for (const [, binding] of Object.entries(KEY_BINDINGS)) {
    if (matchesKeyBinding(event, binding)) {
      const handler = shortcutHandlers.get(binding.action);
      if (handler) {
        event.preventDefault();
        event.stopPropagation();
        handler();
        return;
      }
    }
  }
}

/**
 * Initialize global keyboard shortcut listener
 */
export function initializeShortcuts(): () => void {
  document.addEventListener('keydown', handleKeyboardEvent);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyboardEvent);
  };
}

/**
 * React hook for registering keyboard shortcuts
 */
export function useShortcut(action: string, handler: ShortcutHandler): void {
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    registerShortcut(action, memoizedHandler);

    return () => {
      unregisterShortcut(action);
    };
  }, [action, memoizedHandler]);
}

/**
 * React hook for multiple shortcuts
 */
export function useShortcuts(shortcuts: Record<string, ShortcutHandler>): void {
  useEffect(() => {
    // Register all shortcuts
    Object.entries(shortcuts).forEach(([action, handler]) => {
      registerShortcut(action, handler);
    });

    // Cleanup
    return () => {
      Object.keys(shortcuts).forEach((action) => {
        unregisterShortcut(action);
      });
    };
  }, [shortcuts]);
}

/**
 * Get all registered shortcuts
 */
export function getRegisteredShortcuts(): string[] {
  return Array.from(shortcutHandlers.keys());
}

/**
 * Check if a shortcut is registered
 */
export function isShortcutRegistered(action: string): boolean {
  return shortcutHandlers.has(action);
}

/**
 * Format key binding for display
 */
export function formatKeyBinding(binding: KeyBinding): string {
  const parts: string[] = [];

  if (binding.modifiers.ctrl) parts.push('Ctrl');
  if (binding.modifiers.meta) parts.push('⌘');
  if (binding.modifiers.alt) parts.push('Alt');
  if (binding.modifiers.shift) parts.push('Shift');

  // Add the main key
  const key = binding.key.length === 1 ? binding.key.toUpperCase() : binding.key;
  parts.push(key);

  return parts.join('+');
}

/**
 * Get all available shortcuts with descriptions
 */
export function getAllShortcuts(): Array<{
  action: string;
  description: string;
  keys: string;
}> {
  return Object.entries(KEY_BINDINGS).map(([, binding]) => ({
    action: binding.action,
    description: binding.description,
    keys: formatKeyBinding(binding),
  }));
}
