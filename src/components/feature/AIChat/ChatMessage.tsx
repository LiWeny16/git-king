// Chat Message Component
import { Box, Avatar, alpha } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { MarkdownRenderer } from '../../common/Markdown';
import { ActionCard } from './ActionCard';
import type { ActionBlock } from '../../../app/hooks/useAI';

// Configuration
const CONFIG = {
  avatarSize: 32,
  blinkingCursor: '▋',
};

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  actions?: ActionBlock[];
}

export function ChatMessage({
  role,
  content,
  isStreaming = false,
  actions = [],
}: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: CONFIG.avatarSize,
          height: CONFIG.avatarSize,
          bgcolor: isUser ? 'primary.main' : (theme) => alpha(theme.palette.success.main, 0.15),
          color: isUser ? 'white' : 'success.main',
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 'calc(100% - 50px)',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: isUser
              ? 'primary.main'
              : (theme) => alpha(theme.palette.grey[500], 0.1),
            color: isUser ? 'white' : 'text.primary',
            borderTopRightRadius: isUser ? 0 : undefined,
            borderTopLeftRadius: isUser ? undefined : 0,
          }}
        >
          {isUser ? (
            // User message - plain text
            <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {content}
            </Box>
          ) : (
            // Assistant message - Markdown with streaming cursor
            <>
              <MarkdownRenderer content={content || ' '} />
              {isStreaming && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    animation: 'blink 1s infinite',
                    '@keyframes blink': {
                      '0%, 50%': { opacity: 1 },
                      '51%, 100%': { opacity: 0 },
                    },
                  }}
                >
                  {CONFIG.blinkingCursor}
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Action Cards */}
        {actions.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {actions.map((action, index) => (
              <ActionCard key={index} action={action} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
