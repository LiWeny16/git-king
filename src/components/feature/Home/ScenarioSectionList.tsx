import { Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { itemVariants } from './constants';
import { ScenarioSection } from './ScenarioSection';
import type { ScenarioSection as ScenarioSectionType } from '../../../app/data/homeView';

interface ScenarioSectionListProps {
  sections: ScenarioSectionType[];
  onCopyCommand: (text: string) => void;
}

export function ScenarioSectionList({ sections, onCopyCommand }: ScenarioSectionListProps) {
  return (
    <motion.div variants={itemVariants}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h3" sx={{ fontSize: { xs: '20px', md: '22px' }, fontWeight: 600 }}>
            常见场景
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            点击场景即可看到完整指令序列，适合快速复盘与复制。
          </Typography>
        </Stack>
        {sections.map((section) => (
          <ScenarioSection key={section.title} section={section} onCopyCommand={onCopyCommand} />
        ))}
      </Stack>
    </motion.div>
  );
}
