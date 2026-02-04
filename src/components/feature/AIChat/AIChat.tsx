// AI Chat Container Component with Streaming Support
import { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Paper, Typography, IconButton, alpha, Collapse } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useAIStream, parseActionBlocks, stripActionBlocks } from '../../../app/hooks/useAI';
import { useGitStore } from '../../../store';

// Configuration
const CONFIG = {
  title: 'AI Assistant',
  welcomeMessage: 'Hi! I\'m your Git assistant. Ask me anything about Git commands, workflows, or troubleshooting.',
  placeholder: 'Ask about Git...',
  maxMessages: 50,
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface AIChatProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

export const AIChat = observer(function AIChat({
  onClose,
  onMinimize,
}: AIChatProps) {
  const gitStore = useGitStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: CONFIG.welcomeMessage,
      timestamp: Date.now(),
    },
  ]);
  const [isMinimized, setIsMinimized] = useState(false);

  // AI streaming hook
  const { isStreaming, content: streamingContent, startStream, stopStream } = useAIStream({
    onComplete: (fullText) => {
      // Update the streaming message with final content
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isStreaming
            ? { ...msg, content: stripActionBlocks(fullText), isStreaming: false }
            : msg
        )
      );
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isStreaming),
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${error.message}`,
          timestamp: Date.now(),
        },
      ]);
    },
  });

  // Update streaming message content
  useEffect(() => {
    if (isStreaming && streamingContent) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isStreaming ? { ...msg, content: stripActionBlocks(streamingContent) } : msg
        )
      );
    }
  }, [isStreaming, streamingContent]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      // Add placeholder for AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev.slice(-CONFIG.maxMessages), userMessage, aiMessage]);

      // Start streaming
      await startStream(text);
    },
    [isStreaming, startStream]
  );

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  const hasToken = gitStore.aiToken.length > 0;

  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMinimized ? 'auto' : 500,
        maxHeight: '80vh',
        borderRadius: 3,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
        }}
        onClick={handleMinimize}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            {CONFIG.title}
          </Typography>
          {isStreaming && (
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: 'success.main',
                borderRadius: '50%',
                animation: 'pulse 1s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={handleMinimize}>
            <MinimizeIcon fontSize="small" />
          </IconButton>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={!isMinimized}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 450 }}>
          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {!hasToken && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'warning.light',
                  borderRadius: 2,
                  color: 'warning.contrastText',
                }}
              >
                <Typography variant="body2">
                  ⚠️ Please configure your AI API token in settings to enable AI features.
                </Typography>
              </Box>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                isStreaming={message.isStreaming}
                actions={
                  message.role === 'assistant' && !message.isStreaming
                    ? parseActionBlocks(message.content)
                    : undefined
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            onStop={stopStream}
            isLoading={isStreaming}
            disabled={!hasToken}
            placeholder={hasToken ? CONFIG.placeholder : 'Configure API token in settings...'}
          />
        </Box>
      </Collapse>
    </Paper>
  );
});
