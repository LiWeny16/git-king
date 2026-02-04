import { Card, CardContent, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { MONOSPACE_FONT } from '../../../config/theme';
import type { CommandCategorySection } from '../../../app/data/homeView';

interface CommandCategoryCardProps {
  category: CommandCategorySection;
  onCopyCommand: (text: string) => void;
}

export function CommandCategoryCard({ category, onCopyCommand }: CommandCategoryCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: '100%',
        boxShadow: 'var(--shadow-level-1)',
      }}
      component={motion.div}
      whileHover={{
        y: -2,
        boxShadow: 'var(--shadow-level-2)',
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            {category.title}
          </Typography>
          <Divider sx={{ borderColor: 'divider' }} />
          <List disablePadding>
            {category.commands.map((item, index) => (
              <ListItem
                key={item.command}
                disableGutters
                onClick={() => onCopyCommand(item.command)}
                sx={{
                  py: 1.25,
                  borderBottom: index < category.commands.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  borderRadius: 1,
                  px: 1,
                  mx: -1,
                  transition: 'background-color 0.2s ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: MONOSPACE_FONT,
                        fontSize: { xs: '12px', md: '13px' },
                        wordBreak: 'break-all',
                      }}
                    >
                      {item.command}
                    </Typography>
                  }
                  secondary={item.description}
                  secondaryTypographyProps={{
                    sx: { fontSize: { xs: '11px', md: '13px' }, lineHeight: 1.4 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}
