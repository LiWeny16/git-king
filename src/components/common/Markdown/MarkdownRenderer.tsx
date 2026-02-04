// Markdown Renderer Component - GitHub Style
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Box, Typography, Link, Paper, alpha } from '@mui/material';
import type { Components } from 'react-markdown';
import { CodeBlock } from './CodeBlock';

// Configuration
const CONFIG = {
  maxWidth: '100%',
  codeTheme: 'github',
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Custom components for react-markdown
const markdownComponents: Components = {
  // Headings
  h1: ({ children }) => (
    <Typography
      variant="h4"
      component="h1"
      sx={{ mt: 3, mb: 2, fontWeight: 700, borderBottom: 1, borderColor: 'divider', pb: 1 }}
    >
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography
      variant="h5"
      component="h2"
      sx={{ mt: 3, mb: 1.5, fontWeight: 600, borderBottom: 1, borderColor: 'divider', pb: 0.5 }}
    >
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant="subtitle1" component="h4" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
      {children}
    </Typography>
  ),

  // Paragraphs
  p: ({ children }) => (
    <Typography variant="body1" component="p" sx={{ my: 1.5, lineHeight: 1.7 }}>
      {children}
    </Typography>
  ),

  // Links
  a: ({ href, children }) => (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: 'primary.main',
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {children}
    </Link>
  ),

  // Code blocks
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const isInline = !className;

    if (isInline) {
      return (
        <Box
          component="code"
          sx={{
            px: 0.75,
            py: 0.25,
            mx: 0.25,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            borderRadius: 1,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.875em',
            color: 'primary.main',
          }}
          {...props}
        >
          {children}
        </Box>
      );
    }

    return (
      <CodeBlock language={language} code={String(children).replace(/\n$/, '')} />
    );
  },

  // Pre blocks (wrapper for code)
  pre: ({ children }) => <>{children}</>,

  // Lists
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 3, my: 1.5 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 3, my: 1.5 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box component="li" sx={{ my: 0.5, lineHeight: 1.7 }}>
      {children}
    </Box>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <Paper
      elevation={0}
      sx={{
        pl: 2,
        py: 0.5,
        my: 2,
        borderLeft: 4,
        borderColor: 'primary.main',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
        '& > p': { my: 1 },
      }}
    >
      {children}
    </Paper>
  ),

  // Horizontal rule
  hr: () => <Box component="hr" sx={{ my: 3, border: 0, borderTop: 1, borderColor: 'divider' }} />,

  // Strong and emphasis
  strong: ({ children }) => (
    <Box component="strong" sx={{ fontWeight: 600 }}>
      {children}
    </Box>
  ),
  em: ({ children }) => (
    <Box component="em" sx={{ fontStyle: 'italic' }}>
      {children}
    </Box>
  ),

  // Tables
  table: ({ children }) => (
    <Box sx={{ overflowX: 'auto', my: 2 }}>
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          '& th, & td': {
            px: 2,
            py: 1,
            border: 1,
            borderColor: 'divider',
          },
          '& th': {
            bgcolor: 'action.hover',
            fontWeight: 600,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  ),
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <Box
      className={className}
      sx={{
        maxWidth: CONFIG.maxWidth,
        '& > *:first-of-type': { mt: 0 },
        '& > *:last-child': { mb: 0 },
      }}
    >
      <ReactMarkdown
        components={markdownComponents}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
