// 全局命令解释浮层：无遮罩，悬停 1s 或点击 (i) 触发，展示命令含义/用法/参数/注意事项
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Paper, Typography } from '@mui/material';
import { useUIStore } from '../../../store';
import { Z_INDEX } from '../../../app/constants';

const POPOVER_OFFSET = 8;
const MAX_WIDTH = 380;

export const CommandExplanationPopover = observer(function CommandExplanationPopover() {
  const uiStore = useUIStore();
  const data = uiStore.commandExplanation;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.openBy !== 'click') return;
    const handleMouseDown = (e: MouseEvent) => {
      const el = cardRef.current;
      if (el && !el.contains(e.target as Node)) {
        uiStore.hideCommandExplanation();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [data?.openBy, uiStore]);

  if (!data) return null;

  const { anchor, explanation, variables, optional, dangerous } = data;
  const x = Math.min(anchor.x, window.innerWidth - MAX_WIDTH - 16);
  const y = anchor.y + POPOVER_OFFSET;

  const content = (
    <Paper
      ref={cardRef}
      elevation={3}
      sx={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: Z_INDEX.COMMAND_PALETTE + 1,
        maxWidth: MAX_WIDTH,
        width: 'max-content',
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 12px 28px rgba(0,0,0,0.12)',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          color: 'text.secondary',
          fontWeight: 600,
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        命令含义
      </Typography>
      <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
        {explanation}
      </Typography>
      {variables && variables.length > 0 && (
        <>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontWeight: 600,
              mb: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            参数/占位
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.5, fontFamily: 'monospace', fontSize: '12px' }}>
            {variables.join(', ')}
          </Typography>
        </>
      )}
      {(optional || dangerous) && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {optional && '可选步骤 · '}
          {dangerous && '⚠️ 需谨慎操作'}
        </Typography>
      )}
    </Paper>
  );

  return createPortal(content, document.body);
});
