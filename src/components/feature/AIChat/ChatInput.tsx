// Chat Input Component
import { useState, useCallback, type KeyboardEvent } from 'react';
import { Box, TextField, IconButton, alpha } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';

// Configuration
const CONFIG = {
  maxLength: 2000,
  rows: 1,
  maxRows: 4,
};

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isLoading = false,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !isLoading && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  }, [value, isLoading, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={CONFIG.rows}
        maxRows={CONFIG.maxRows}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, CONFIG.maxLength))}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'background.paper',
          },
        }}
        InputProps={{
          sx: {
            fontSize: '0.95rem',
          },
        }}
      />

      {isLoading ? (
        // Stop button when streaming
        <IconButton
          onClick={onStop}
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          <StopIcon />
        </IconButton>
      ) : (
        // Send button
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          sx={{
            bgcolor: canSend ? 'primary.main' : 'action.disabledBackground',
            color: canSend ? 'white' : 'action.disabled',
            '&:hover': {
              bgcolor: canSend ? 'primary.dark' : 'action.disabledBackground',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      )}
    </Box>
  );
}
