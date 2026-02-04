import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { itemVariants } from './constants';
import { CommandCategoryCard } from './CommandCategoryCard';
import type { CommandCategorySection as CommandCategorySectionType } from '../../../app/data/homeView';

interface CommandCategorySectionProps {
  categories: CommandCategorySectionType[];
  onCopyCommand: (text: string) => void;
}

export function CommandCategorySection({ categories, onCopyCommand }: CommandCategorySectionProps) {
  return (
    <motion.div variants={itemVariants}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3" sx={{ fontSize: { xs: '20px', md: '22px' }, fontWeight: 600 }}>
            Git 指令大全
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            按场景分类的高频指令列表，适合日常快速查阅。
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 2.5,
          }}
        >
          {categories.map((category) => (
            <CommandCategoryCard
              key={category.title}
              category={category}
              onCopyCommand={onCopyCommand}
            />
          ))}
        </Box>
      </Stack>
    </motion.div>
  );
}
