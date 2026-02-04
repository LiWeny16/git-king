// Git Branch Node Component for React Flow
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, alpha } from '@mui/material';

// Using inline SVG icon to avoid @mui/icons-material dependency issues
const TagIconSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
  </svg>
);

// Configuration
const CONFIG = {
  minWidth: 80,
  maxWidth: 140,
};

interface BranchNodeData {
  name: string;
  isCurrent?: boolean;
  [key: string]: unknown;
}

interface GitBranchNodeProps {
  data: BranchNodeData;
  selected?: boolean;
}

export const GitBranchNode = memo(function GitBranchNode({
  data,
  selected,
}: GitBranchNodeProps) {
  const isCurrent = data.isCurrent ?? false;

  return (
    <>
      {/* Connection handle */}
      <Handle
        type="source"
        position={Position.Left}
        style={{
          background: isCurrent ? '#34C759' : '#8E8E93',
          width: 8,
          height: 8,
          border: '2px solid white',
        }}
      />

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1.5,
          py: 0.75,
          minWidth: CONFIG.minWidth,
          maxWidth: CONFIG.maxWidth,
          bgcolor: isCurrent
            ? (theme) => alpha(theme.palette.success.main, 0.15)
            : 'background.paper',
          border: 2,
          borderColor: isCurrent ? 'success.main' : selected ? 'primary.main' : 'divider',
          borderRadius: 'full',
          transition: 'all 0.2s ease',
          boxShadow: selected ? 3 : 1,
          cursor: 'pointer',
          '&:hover': {
            borderColor: isCurrent ? 'success.dark' : 'primary.main',
            boxShadow: 2,
          },
        }}
      >
        <Box
          sx={{
            fontSize: 14,
            color: isCurrent ? 'success.main' : 'text.secondary',
            display: 'flex',
          }}
        >
          <TagIconSvg />
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: isCurrent ? 'success.main' : 'text.primary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.name}
        </Typography>
        {isCurrent && (
          <Box
            sx={{
              width: 6,
              height: 6,
              bgcolor: 'success.main',
              borderRadius: '50%',
              ml: 0.5,
            }}
          />
        )}
      </Box>
    </>
  );
});
