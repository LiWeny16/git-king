// Action Card Component for AI-generated commands
import { useState, useCallback } from 'react';
import { Box, Button, Typography, Tooltip, alpha } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import MergeIcon from '@mui/icons-material/Merge';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'sonner';
import { copyToClipboard } from '../../../app/utils/clipboard';
import type { ActionBlock } from '../../../app/hooks/useAI';

// Configuration
const CONFIG = {
  copyFeedbackDuration: 2000,
};

// Icon mapping for action types
const ACTION_ICONS: Record<string, typeof MergeIcon> = {
  merge: MergeIcon,
  checkout: CallSplitIcon,
  push: CloudUploadIcon,
  commit: SaveIcon,
  custom: PlayArrowIcon,
};

// Color mapping for action types
const ACTION_COLORS: Record<string, string> = {
  merge: '#5856D6',
  checkout: '#007AFF',
  push: '#34C759',
  commit: '#FF9500',
  custom: '#8E8E93',
};

interface ActionCardProps {
  action: ActionBlock;
  onExecute?: (action: ActionBlock) => void;
}

export function ActionCard({ action, onExecute }: ActionCardProps) {
  const [copied, setCopied] = useState(false);

  const Icon = ACTION_ICONS[action.type] || PlayArrowIcon;
  const color = ACTION_COLORS[action.type] || ACTION_COLORS.custom;

  // Generate command string based on action type
  const getCommand = useCallback((): string => {
    switch (action.type) {
      case 'merge':
        return `git merge ${action.source || ''}`;
      case 'checkout':
        return `git checkout ${action.source || ''}`;
      case 'push':
        return 'git push';
      case 'commit':
        return 'git commit -m "message"';
      case 'custom':
        return action.command || '';
      default:
        return '';
    }
  }, [action]);

  // Generate label based on action
  const getLabel = useCallback((): string => {
    if (action.label) return action.label;

    switch (action.type) {
      case 'merge':
        return `Merge ${action.source || 'branch'}`;
      case 'checkout':
        return `Checkout ${action.source || 'branch'}`;
      case 'push':
        return 'Push changes';
      case 'commit':
        return 'Commit changes';
      case 'custom':
        return action.command || 'Run command';
      default:
        return 'Execute';
    }
  }, [action]);

  const handleCopy = useCallback(async () => {
    const command = getCommand();
    if (command) {
      const success = await copyToClipboard(command);
      if (success) {
        setCopied(true);
        toast.success(`Copied: ${command}`);
        setTimeout(() => setCopied(false), CONFIG.copyFeedbackDuration);
      }
    }
  }, [getCommand]);

  const handleExecute = useCallback(() => {
    if (onExecute) {
      onExecute(action);
    } else {
      // Default: copy to clipboard
      handleCopy();
    }
  }, [action, onExecute, handleCopy]);

  const label = getLabel();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        p: 0.5,
        pl: 1.5,
        bgcolor: alpha(color, 0.1),
        border: 1,
        borderColor: alpha(color, 0.3),
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: alpha(color, 0.15),
          borderColor: color,
        },
      }}
    >
      <Icon sx={{ fontSize: 16, color }} />

      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>

      {/* Copy button */}
      <Tooltip title={copied ? 'Copied!' : 'Copy command'}>
        <Button
          size="small"
          variant="text"
          onClick={handleCopy}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: copied ? 'success.main' : 'text.secondary',
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </Button>
      </Tooltip>

      {/* Execute button (optional) */}
      {onExecute && (
        <Tooltip title="Execute">
          <Button
            size="small"
            variant="contained"
            onClick={handleExecute}
            sx={{
              minWidth: 'auto',
              p: 0.5,
              bgcolor: color,
              '&:hover': {
                bgcolor: color,
                filter: 'brightness(0.9)',
              },
            }}
          >
            <PlayArrowIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}
    </Box>
  );
}
