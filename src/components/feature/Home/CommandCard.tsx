import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AnimatePresence, motion } from 'framer-motion';
import { MONOSPACE_FONT } from '../../../config/theme';
import { useModifierKey } from '../../../app/hooks';

export interface CommandCardProps {
  command: string;
  explanation: string;
  onCopy: (text: string) => void;
}

/**
 * 单条命令卡片：支持 Modifier Peek（悬停 + 按住 Ctrl 展开解释）与移动端 (i) 降级。
 * 见 specs/interaction.md §2、§3。
 */
export function CommandCard({ command, explanation, onCopy }: CommandCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [toggledOpen, setToggledOpen] = useState(false);
  const isCtrlPressed = useModifierKey('Control');
  const isTouch = useMediaQuery('(pointer: coarse)');

  const isPeeking = isTouch ? toggledOpen : isHovered && isCtrlPressed;

  return (
    <div
      className="command-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          position: 'relative',
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: 'var(--code-bg)',
          border: '1px solid',
          borderColor: 'var(--border-subtle)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
            transform: 'scale(1.01)',
          },
          ...(isPeeking && { cursor: 'context-menu' as const }),
        }}
        onClick={() => !isTouch && onCopy(command)}
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
          {isTouch ? (
            <Tooltip title={toggledOpen ? '收起解释' : '查看解释'}>
              <IconButton
                size="small"
                sx={{ p: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setToggledOpen((v) => !v);
                }}
                aria-label={toggledOpen ? '收起解释' : '查看解释'}
              >
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="复制">
              <IconButton
                size="small"
                sx={{ p: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(command);
                }}
              >
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Hint: 仅在 Hover 且未 Peek 时显示 (spec §2.2) */}
        {!isTouch && isHovered && !isPeeking && (
          <Typography
            component="span"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 12,
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              animation: 'fade-in 0.15s ease-out',
            }}
          >
            Hold Ctrl to explain
          </Typography>
        )}
      </Box>

      {/* 解释面板 (Peeking Layer) - Height 动画 (spec §2.2, §2.3) */}
      <AnimatePresence>
        {isPeeking && explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            className="explanation-panel"
          >
            <Box
              sx={{
                mx: 0.5,
                p: 1.5,
                fontSize: '12px',
                color: 'var(--text-secondary)',
                bgcolor: 'var(--bg-canvas)',
                border: '1px solid',
                borderTop: 'none',
                borderColor: 'var(--border-subtle)',
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
              }}
            >
              {explanation}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
