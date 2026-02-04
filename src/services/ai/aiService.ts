// AI Service for streaming chat completions

// Configuration
const CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  defaultModel: 'gpt-4o-mini',
  maxTokens: 2048,
  temperature: 0.7,
};

// Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  finishReason: string | null;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export type StreamCallback = (chunk: string, done: boolean) => void;

interface ChatCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * AI Service class for handling OpenAI API interactions
 */
export class AIService {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  /**
   * Update API token
   */
  setToken(token: string): void {
    this.apiToken = token;
  }

  /**
   * Check if token is configured
   */
  hasToken(): boolean {
    return !!this.apiToken && this.apiToken.length > 0;
  }

  /**
   * Non-streaming chat completion
   */
  async chat(messages: ChatMessage[], options: ChatCompletionOptions = {}): Promise<AIResponse> {
    const { model = CONFIG.defaultModel, maxTokens = CONFIG.maxTokens, temperature = CONFIG.temperature } = options;

    const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      content: choice?.message?.content || '',
      finishReason: choice?.finish_reason || null,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Streaming chat completion
   */
  async streamChat(
    messages: ChatMessage[],
    onChunk: StreamCallback,
    options: ChatCompletionOptions = {},
    signal?: AbortSignal
  ): Promise<string> {
    const { model = CONFIG.defaultModel, maxTokens = CONFIG.maxTokens, temperature = CONFIG.temperature } = options;

    const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onChunk('', true);
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onChunk(content, false);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullContent;
  }

  /**
   * Quick Git help query
   */
  async getGitHelp(query: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are Git King, an expert Git assistant. Provide concise, practical Git command help.
Format your response with clear command examples using code blocks.
When suggesting multiple steps, number them clearly.`,
      },
      { role: 'user', content: query },
    ];

    const response = await this.chat(messages);
    return response.content;
  }
}

// Default instance (token will be set later)
export const aiService = new AIService('');
