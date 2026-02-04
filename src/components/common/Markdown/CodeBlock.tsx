// Code Block Component with copy functionality
import { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip, Typography, alpha } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { copyToClipboard } from '../../../app/utils/clipboard';

// Configuration
const CONFIG = {
  copyFeedbackDuration: 2000,
  maxHeight: 400,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

export function CodeBlock({
  code,
  language = '',
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), CONFIG.copyFeedbackDuration);
    }
  }, [code]);

  const lines = code.split('\n');

  return (
    <Box
      sx={{
        my: 2,
        borderRadius: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        bgcolor: (theme) => alpha(theme.palette.common.black, 0.03),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          bgcolor: 'action.hover',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language badge */}
          {language && (
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.65rem',
              }}
            >
              {language}
            </Typography>
          )}
          {/* Filename */}
          {filename && (
            <Typography variant="caption" color="text.secondary">
              {filename}
            </Typography>
          )}
        </Box>

        {/* Copy button */}
        <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: copied ? 'success.main' : 'text.secondary',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Code content */}
      <Box
        sx={{
          overflow: 'auto',
          maxHeight: CONFIG.maxHeight,
          p: 2,
        }}
      >
        <Box
          component="pre"
          sx={{
            m: 0,
            fontFamily: CONFIG.fontFamily,
            fontSize: '0.875rem',
            lineHeight: 1.6,
            display: 'flex',
          }}
        >
          {/* Line numbers */}
          {showLineNumbers && (
            <Box
              component="span"
              sx={{
                pr: 2,
                mr: 2,
                borderRight: 1,
                borderColor: 'divider',
                color: 'text.disabled',
                userSelect: 'none',
                textAlign: 'right',
              }}
            >
              {lines.map((_, i) => (
                <Box key={i} component="span" sx={{ display: 'block' }}>
                  {i + 1}
                </Box>
              ))}
            </Box>
          )}

          {/* Code */}
          <Box
            component="code"
            className={language ? `language-${language}` : undefined}
            sx={{
              fontFamily: 'inherit',
              flex: 1,
              '& .hljs-keyword': { color: '#d73a49' },
              '& .hljs-string': { color: '#032f62' },
              '& .hljs-comment': { color: '#6a737d' },
              '& .hljs-function': { color: '#6f42c1' },
              '& .hljs-number': { color: '#005cc5' },
              '& .hljs-built_in': { color: '#e36209' },
              '& .hljs-attr': { color: '#005cc5' },
              '& .hljs-variable': { color: '#24292e' },
            }}
          >
            {code}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
