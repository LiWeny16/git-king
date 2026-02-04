import { observer } from 'mobx-react-lite';
import { Box, Chip, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import { getKeyBindingDisplay } from '../../../config/keymaps';
import { MONOSPACE_FONT } from '../../../config/theme';
import { useUIStore } from '../../../store';
import { itemVariants } from './constants';

export const HomeHero = observer(function HomeHero() {
  const uiStore = useUIStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div variants={itemVariants}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'flex-end' }}
          spacing={2}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '28px', sm: '34px' },
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              👑 Git King
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1.5, lineHeight: 1.5, maxWidth: 480 }}
            >
              场景优先的 Git 速查库与指令面板，帮你从问题直达命令序列。
            </Typography>
          </Box>
          <Paper
            component={motion.div}
            whileHover={{ boxShadow: 2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => uiStore.openCommandPalette()}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: { xs: '100%', sm: 280 },
              maxWidth: { sm: 360 },
              height: 44,
              px: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'left' }}>
              搜索场景或指令…
            </Typography>
            <Chip
              label={getKeyBindingDisplay('OPEN_COMMAND_PALETTE')}
              size="small"
              sx={{ fontFamily: MONOSPACE_FONT, fontSize: '11px', height: 22, borderRadius: 1 }}
            />
          </Paper>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Scenario → Command" color="primary" size={isMobile ? 'small' : 'medium'} />
          <Chip
            label="Command Palette"
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
            onClick={() => uiStore.openCommandPalette()}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`快捷键 ${getKeyBindingDisplay('OPEN_COMMAND_PALETTE')}`}
            variant="outlined"
            onClick={() => uiStore.openCommandPalette()}
            sx={{ cursor: 'pointer' }}
            size={isMobile ? 'small' : 'medium'}
          />
        </Stack>
      </Stack>
    </motion.div>
  );
});
