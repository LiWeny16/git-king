// Git Commit Node Component for React Flow
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography, Tooltip, alpha } from '@mui/material';

// Using inline SVG icon to avoid @mui/icons-material dependency issues
const CommitIconSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v6m0 8v6" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

// Configuration
const CONFIG = {
  width: 160,
  hashLength: 7,
  messageMaxLength: 30,
};

interface CommitNodeData {
  hash: string;
  message: string;
  author?: string;
  [key: string]: unknown;
}

interface GitCommitNodeProps {
  data: CommitNodeData;
  selected?: boolean;
}

export const GitCommitNode = memo(function GitCommitNode({
  data,
  selected,
}: GitCommitNodeProps) {
  const shortHash = data.hash.substring(0, CONFIG.hashLength);
  const shortMessage =
    data.message.length > CONFIG.messageMaxLength
      ? `${data.message.substring(0, CONFIG.messageMaxLength)}...`
      : data.message;

  return (
    <>
      {/* Input handle (from children) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#007AFF',
          width: 8,
          height: 8,
          border: '2px solid white',
        }}
      />

      <Tooltip title={data.message} placement="right">
        <Box
          sx={{
            width: CONFIG.width,
            bgcolor: 'background.paper',
            border: 2,
            borderColor: selected ? 'primary.main' : 'divider',
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            boxShadow: selected ? 4 : 1,
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: 3,
            },
          }}
        >
          {/* Header with hash */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.75,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ fontSize: 14, color: 'primary.main', display: 'flex' }}>
              <CommitIconSvg />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {shortHash}
            </Typography>
          </Box>

          {/* Message */}
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                lineHeight: 1.4,
                color: 'text.primary',
              }}
            >
              {shortMessage}
            </Typography>
            {data.author && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  color: 'text.secondary',
                  fontSize: '0.65rem',
                }}
              >
                {data.author}
              </Typography>
            )}
          </Box>
        </Box>
      </Tooltip>

      {/* Output handle (to parents) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#007AFF',
          width: 8,
          height: 8,
          border: '2px solid white',
        }}
      />
    </>
  );
});
