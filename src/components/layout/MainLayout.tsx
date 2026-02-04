// Main Layout Component - iOS Style
import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

// Layout configuration (specs/UIUX.md §2.1: Mobile 100% px16, Tablet 720px, Desktop 1024px)
const CONFIG = {
  headerHeight: 56,
  sidebarWidth: 280,
  maxContentWidth: { xs: '100%', sm: 720, md: 1024 },
  padding: {
    mobile: 16,
    desktop: 24,
  },
};

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export function MainLayout({
  children,
  showSidebar = false,
  showHeader = true,
}: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      {showHeader && <Header />}

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          pt: showHeader ? `${CONFIG.headerHeight}px` : 0,
        }}
      >
        {/* Sidebar */}
        {showSidebar && <Sidebar width={CONFIG.sidebarWidth} />}

        {/* Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            p: { xs: `${CONFIG.padding.mobile}px`, md: `${CONFIG.padding.desktop}px` },
          }}
        >
          <Box
            sx={{
              maxWidth: CONFIG.maxContentWidth,
              width: '100%',
              mx: 'auto',
              flex: 1,
              px: { xs: 2, sm: 3 },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
