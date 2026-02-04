// Sidebar Component - iOS Style Navigation
import { observer } from 'mobx-react-lite';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  alpha,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryIcon from '@mui/icons-material/History';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';

// Configuration
const CONFIG = {
  sections: [
    {
      title: 'Navigation',
      items: [
        { id: 'home', label: 'Home', icon: HomeIcon },
        { id: 'commands', label: 'Commands', icon: CodeIcon },
        { id: 'workflows', label: 'Workflows', icon: AccountTreeIcon },
        { id: 'history', label: 'History', icon: HistoryIcon },
      ],
    },
    {
      title: 'Tools',
      items: [
        { id: 'ai', label: 'AI Assistant', icon: SmartToyIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
  ],
};

interface SidebarProps {
  width?: number;
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export const Sidebar = observer(function Sidebar({
  width = 280,
  activeItem = 'home',
  onItemClick,
}: SidebarProps) {
  return (
    <Box
      component="aside"
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
        borderRight: 1,
        borderColor: 'divider',
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box sx={{ py: 2 }}>
        {CONFIG.sections.map((section, sectionIndex) => (
          <Box key={section.title}>
            {sectionIndex > 0 && <Divider sx={{ my: 2 }} />}

            {/* Section Title */}
            <Typography
              variant="overline"
              sx={{
                px: 2,
                py: 1,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              {section.title}
            </Typography>

            {/* Section Items */}
            <List disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <ListItem key={item.id} disablePadding sx={{ px: 1 }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => onItemClick?.(item.id)}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
});
