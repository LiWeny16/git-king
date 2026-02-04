import { useRef, useCallback } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MONOSPACE_FONT } from '../../../config/theme';
import { useUIStore } from '../../../store';

export interface CommandCardProps {
  command: string;
  explanation: string;
  onCopy: (text: string) => void;
  variables?: string[];
  optional?: boolean;
  dangerous?: boolean;
}

/**
 * 单条命令卡片：点击整行默认复制；悬停 1s 或点击 (i) 显示全局解释浮层。
 */
export function CommandCard({
  command,
  explanation,
  onCopy,
  variables,
  optional,
  dangerous,
}: CommandCardProps) {
  const uiStore = useUIStore();
  const rowRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showExplanation = useCallback(
    (anchor: { x: number; y: number }, openBy: 'hover' | 'click') => {
      uiStore.showCommandExplanation({
        command,
        explanation,
        variables,
        optional,
        dangerous,
        anchor,
        openBy,
      });
    },
    [command, explanation, variables, optional, dangerous, uiStore]
  );

  const handleMouseEnter = () => {
    hoverTimerRef.current = window.setTimeout(() => {
      hoverTimerRef.current = null;
      const rect = rowRef.current?.getBoundingClientRect();
      if (rect)
        showExplanation(
          { x: rect.left, y: rect.bottom },
          'hover'
        );
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    uiStore.hideCommandExplanationIfFromHover();
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    showExplanation({ x: rect.left, y: rect.bottom }, 'click');
  };

  return (
    <div className="command-card-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Box
        ref={rowRef}
        sx={{
          position: 'relative',
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: 'var(--code-bg)',
          border: '1px solid',
          borderColor: 'var(--border-subtle)',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => onCopy(command)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              fontFamily: MONOSPACE_FONT,
              fontSize: { xs: '12px', md: '13px' },
              wordBreak: 'break-all',
            }}
          >
            {command}
          </Typography>
          <Tooltip title="查看解释">
            <IconButton
              size="small"
              sx={{ p: 0.5 }}
              onClick={handleInfoClick}
              aria-label="查看解释"
            >
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="复制">
            <IconButton
              size="small"
              sx={{ p: 0.5 }}
              onClick={(e) => {
                e.stopPropagation();
                onCopy(command);
              }}
              aria-label="复制"
            >
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </div>
  );
}
