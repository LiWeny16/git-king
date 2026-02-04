// Header - Sticky 顶栏 (specs/UIUX.md §2.2 z-index 1100)
import { observer } from 'mobx-react-lite';
import { AppBar, Box, IconButton, Toolbar, Typography, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useUIStore } from '../../store';
import { getKeyBindingDisplay } from '../../config/keymaps';
import { Z_INDEX } from '../../app/constants';

const HEADER_HEIGHT = 64; // 与 MUI Toolbar 默认一致，避免 div 与背景错位

const CONFIG = {
  height: HEADER_HEIGHT,
  logoText: 'Git King',
  logoEmoji: '👑',
};

export const Header = observer(function Header() {
  const uiStore = useUIStore();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
        zIndex: Z_INDEX.STICKY_HEADER,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: HEADER_HEIGHT,
          minHeight: HEADER_HEIGHT,
          maxHeight: HEADER_HEIGHT,
          px: { xs: 2, md: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" component="span" sx={{ fontSize: '1.5rem' }}>
            {CONFIG.logoEmoji}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {CONFIG.logoText}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button */}
          <Tooltip title={`Search (${getKeyBindingDisplay('OPEN_COMMAND_PALETTE')})`}>
            <IconButton
              onClick={() => uiStore.openCommandPalette()}
              sx={{
                bgcolor: 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Settings Button */}
          <Tooltip title="Settings">
            <IconButton
              onClick={() => uiStore.openSettingsModal()}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* GitHub Link */}
          <Tooltip title="View on GitHub">
            <IconButton
              component="a"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
});
