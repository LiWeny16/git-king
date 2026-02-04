import { Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { getKeyBindingDisplay } from '../../../config/keymaps';
import { useUIStore } from '../../../store';
import { itemVariants } from './constants';

export function QuickEntryCard() {
  const uiStore = useUIStore();

  return (
    <motion.div variants={itemVariants}>
      <Card
        component={motion.div}
        whileHover={{ boxShadow: 2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h4" fontWeight={600}>
              快速入口
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              使用命令面板进行模糊搜索，先按场景，再定位到具体指令。
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
                onClick={() => uiStore.openCommandPalette()}
              >
                <Typography variant="h6" fontWeight={600}>
                  Command Palette
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                  唤起快捷键：{getKeyBindingDisplay('OPEN_COMMAND_PALETTE')}
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ flex: 1, p: 2.5, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  聚合搜索
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                  同时检索常见场景与原子指令，提升排查效率。
                </Typography>
              </Paper>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}
