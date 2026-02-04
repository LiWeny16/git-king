// Clipboard utility functions for copying text and commands

/**
 * Copy text to clipboard using modern Clipboard API
 * Falls back to legacy method if Clipboard API is not available
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-secure contexts
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Legacy clipboard copy method using textarea
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}

/**
 * Copy multiple commands as a sequence
 */
export async function copyCommandSequence(commands: string[]): Promise<boolean> {
  const text = commands.join('\n');
  return copyToClipboard(text);
}

/**
 * Copy command with optional comment
 */
export async function copyCommandWithComment(
  command: string,
  comment?: string
): Promise<boolean> {
  const text = comment ? `# ${comment}\n${command}` : command;
  return copyToClipboard(text);
}

/**
 * Format and copy workflow steps
 */
export async function copyWorkflowSteps(
  steps: Array<{ command: string; description: string }>
): Promise<boolean> {
  const text = steps
    .map((step) => `# ${step.description}\n${step.command}`)
    .join('\n\n');
  return copyToClipboard(text);
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}
