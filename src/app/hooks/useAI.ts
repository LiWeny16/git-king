// AI Streaming Hook for chat completions
import { useState, useCallback, useRef } from 'react';
import { useGitStore } from '../../store';

// Configuration constants
const CONFIG = {
  defaultModel: 'gpt-4o-mini',
  maxTokens: 2048,
  temperature: 0.7,
  streamEndMarker: '[DONE]',
};

// Types
export interface UseAIStreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  systemPrompt?: string;
}

export interface UseAIStreamReturn {
  isStreaming: boolean;
  content: string;
  error: Error | null;
  startStream: (prompt: string) => Promise<void>;
  stopStream: () => void;
  clearContent: () => void;
}

export interface ActionBlock {
  type: 'merge' | 'checkout' | 'commit' | 'push' | 'custom';
  source?: string;
  target?: string;
  command?: string;
  label?: string;
}

/**
 * Parse action blocks from AI response
 * Format: :::action{type="merge", source="dev"}:::
 */
export function parseActionBlocks(text: string): ActionBlock[] {
  const actionRegex = /:::action\{([^}]+)\}:::/g;
  const actions: ActionBlock[] = [];
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    const propsString = match[1];
    const props: Record<string, string> = {};

    // Parse key="value" pairs
    const propRegex = /(\w+)="([^"]*)"/g;
    let propMatch;
    while ((propMatch = propRegex.exec(propsString)) !== null) {
      props[propMatch[1]] = propMatch[2];
    }

    if (props.type) {
      actions.push({
        type: props.type as ActionBlock['type'],
        source: props.source,
        target: props.target,
        command: props.command,
        label: props.label,
      });
    }
  }

  return actions;
}

/**
 * Remove action blocks from text for display
 */
export function stripActionBlocks(text: string): string {
  return text.replace(/:::action\{[^}]+\}:::/g, '').trim();
}

/**
 * Custom hook for AI streaming responses
 */
export function useAIStream(options: UseAIStreamOptions = {}): UseAIStreamReturn {
  const { onChunk, onComplete, onError, systemPrompt } = options;
  const gitStore = useGitStore();

  const [isStreaming, setIsStreaming] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const defaultSystemPrompt = `You are Git King, an expert Git assistant. Help users with Git commands and workflows.
When suggesting actions, use this format: :::action{type="checkout", source="main"}:::
Available action types: merge, checkout, commit, push, custom
For custom actions, provide the full command: :::action{type="custom", command="git stash pop", label="Restore stash"}:::
Always be concise and practical.`;

  const startStream = useCallback(
    async (prompt: string) => {
      if (!gitStore.aiToken) {
        const err = new Error('AI Token not configured. Please add your API token in settings.');
        setError(err);
        onError?.(err);
        return;
      }

      // Reset state
      setIsStreaming(true);
      setContent('');
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${gitStore.aiToken}`,
          },
          body: JSON.stringify({
            model: CONFIG.defaultModel,
            messages: [
              { role: 'system', content: systemPrompt || defaultSystemPrompt },
              { role: 'user', content: prompt },
            ],
            max_tokens: CONFIG.maxTokens,
            temperature: CONFIG.temperature,
            stream: true,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === CONFIG.streamEndMarker) {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullText += content;
                  setContent(fullText);
                  onChunk?.(content);
                }
              } catch {
                // Skip invalid JSON lines
              }
            }
          }
        }

        onComplete?.(fullText);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // User cancelled - not an error
          return;
        }
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [gitStore.aiToken, onChunk, onComplete, onError, systemPrompt, defaultSystemPrompt]
  );

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const clearContent = useCallback(() => {
    setContent('');
    setError(null);
  }, []);

  return {
    isStreaming,
    content,
    error,
    startStream,
    stopStream,
    clearContent,
  };
}
