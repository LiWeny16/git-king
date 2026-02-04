import { Box, Stack, Typography } from '@mui/material';
import { scenarioSectionIcons } from './constants';
import { ScenarioCard } from './ScenarioCard';
import type { ScenarioSection as ScenarioSectionType } from '../../../app/data/homeView';

interface ScenarioSectionProps {
  section: ScenarioSectionType;
  onCopyCommand: (text: string) => void;
}

export function ScenarioSection({ section, onCopyCommand }: ScenarioSectionProps) {
  const SectionIcon = scenarioSectionIcons[section.title];

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {SectionIcon && <SectionIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
        <Typography variant="h5" fontWeight={600}>
          {section.title}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 2.5,
        }}
      >
        {section.items.map((item) => (
          <ScenarioCard key={item.id} item={item} onCopyCommand={onCopyCommand} />
        ))}
      </Box>
    </Stack>
  );
}
