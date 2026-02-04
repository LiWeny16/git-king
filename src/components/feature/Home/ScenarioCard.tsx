import { observer } from 'mobx-react-lite';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useUIStore } from '../../../store';
import type { ScenarioItem } from '../../../app/data/homeView';
import { CommandCard } from './CommandCard';

export interface ScenarioCardProps {
  item: ScenarioItem;
  onCopyCommand: (text: string) => void;
}

/**
 * 场景卡片：使用流程连接器（管道线 + 节点）串联步骤，步骤采用 CommandCard（Modifier Peek）。
 * 见 specs/interaction.md §1 与 §2。
 */
export const ScenarioCard = observer(function ScenarioCard({
  item,
  onCopyCommand,
}: ScenarioCardProps) {
  const uiStore = useUIStore();

  return (
    <Card
      data-scenario-id={item.id}
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: 'var(--shadow-level-1)',
        transition: 'box-shadow 0.2s ease, transform 0.1s ease',
        '&.scenario-card-flash': { animation: 'scenario-flash 1s ease-out' },
      }}
      component={motion.div}
      whileHover={{
        y: -2,
        boxShadow: 'var(--shadow-level-2)',
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      className={uiStore.highlightScenarioId === item.id ? 'scenario-card-flash' : ''}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              {item.description}
            </Typography>
          </Stack>
          <div className="workflow-container">
            {item.steps.map((step) => (
              <CommandCard
                key={step.command}
                command={step.command}
                explanation={step.description}
                onCopy={onCopyCommand}
              />
            ))}
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
});
