import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useUIStore } from '../../../store';
import { copyToClipboard } from '../../../app/utils/clipboard';
import { getScenarioSections, getCommandCategorySections } from '../../../app/data/homeView';
import { containerVariants, HEADER_SCROLL_OFFSET } from './constants';
import { HomeHero } from './HomeHero';
import { QuickEntryCard } from './QuickEntryCard';
import { ScenarioSectionList } from './ScenarioSectionList';
import { CommandCategorySection } from './CommandCategorySection';

export const HomePage = observer(function HomePage() {
  const uiStore = useUIStore();

  const scenarioSections = useMemo(() => getScenarioSections(), []);
  const commandCategories = useMemo(() => getCommandCategorySections(), []);

  useEffect(() => {
    if (!uiStore.highlightScenarioId) return;
    const el = document.querySelector(`[data-scenario-id="${uiStore.highlightScenarioId}"]`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
    const t = setTimeout(() => uiStore.clearHighlightScenarioId(), 1000);
    return () => clearTimeout(t);
  }, [uiStore, uiStore.highlightScenarioId]);

  const handleCopyCommand = async (text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) uiStore.showSuccessToast('已复制到剪贴板');
  };

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 7 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 4, md: 6 }}>
          <HomeHero />
          <QuickEntryCard />
          <ScenarioSectionList sections={scenarioSections} onCopyCommand={handleCopyCommand} />
          <CommandCategorySection
            categories={commandCategories}
            onCopyCommand={handleCopyCommand}
          />
        </Stack>
      </motion.div>
    </Box>
  );
});
