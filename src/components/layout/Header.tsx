// Header - Sticky 毛玻璃顶栏 (specs/UIUX.md §2.2 z-index 1100)
import { observer } from 'mobx-react-lite';
import { AppBar, Box, IconButton, Toolbar, Typography, Tooltip, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useUIStore } from '../../store';
import { getKeyBindingDisplay } from '../../config/keymaps';
import { Z_INDEX } from '../../app/constants';

const CONFIG = {
  height: 56,
  logoText: 'Git King',
  logoEmoji: '👑',
  // 毛玻璃: iOS 标准模糊 (specs/UIUX.md §1.2)
  backdropBlur: 'blur(20px) saturate(180%)',
};

export const Header = observer(function Header() {
  const uiStore = useUIStore();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: CONFIG.height,
        zIndex: Z_INDEX.STICKY_HEADER,
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.72),
        backdropFilter: CONFIG.backdropBlur,
        WebkitBackdropFilter: CONFIG.backdropBlur,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          height: '100%',
          px: { xs: 2, md: 3 },
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
