import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { motion } from 'framer-motion';
import { useUIStore, useVariableStore } from '../../../store';
import { getWorkflowById } from '../../../app/data/workflows';
import { copyWorkflowSteps } from '../../../app/utils/clipboard';
import { substituteCommand } from '../../../app/utils/substituteCommand';
import type { ScenarioItem } from '../../../app/data/homeView';
import { CommandCard } from './CommandCard';

export interface ScenarioCardProps {
  item: ScenarioItem;
  onCopyCommand: (text: string) => void;
}

/**
 * 场景卡片：使用流程连接器串联步骤，右上角提供复制工作流 / 解释 / 配置。
 */
export const ScenarioCard = observer(function ScenarioCard({
  item,
  onCopyCommand,
}: ScenarioCardProps) {
  const uiStore = useUIStore();
  const variableStore = useVariableStore();
  const [explainAnchor, setExplainAnchor] = useState<HTMLElement | null>(null);
  const workflow = getWorkflowById(item.id);
  const hasVariables = workflow?.steps.some((s) => s.variables?.length) ?? false;
  const snapshot = variableStore.variablesSnapshot;

  const handleCopyWorkflow = () => {
    if (!workflow) return;
    copyWorkflowSteps(workflow.steps).then(() => {
      uiStore.showSuccessToast(`已复制工作流: ${item.title}`);
    });
  };

  const handleOpenConfig = () => {
    uiStore.openWorkflowConfig(item.id);
  };

  /** 重置当前卡片所用到的变量（仅影响本工作流占位符） */
  const handleResetConfig = () => {
    if (!workflow) return;
    const keys = new Set<string>();
    for (const step of workflow.steps) {
      for (const v of step.variables ?? []) {
        keys.add(v);
      }
    }
    keys.forEach((key) => variableStore.deleteVariable(key));
    uiStore.showSuccessToast('已重置该卡片配置');
  };

  return (
    <Card
      data-scenario-id={item.id}
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: 'var(--shadow-level-1)',
        transition: 'box-shadow 0.2s ease',
        '&.scenario-card-flash': { animation: 'scenario-flash 1s ease-out' },
      }}
      component={motion.div}
      whileHover={{
        y: -2,
        boxShadow: 'var(--shadow-level-2)',
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      }}
      className={uiStore.highlightScenarioId === item.id ? 'scenario-card-flash' : ''}
    >
      <CardContent sx={{ px: { xs: 4.5, md: 5 } ,py: { xs: 4.5, md: 6 }}}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                {item.description}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
              <Tooltip title="复制工作流">
                <IconButton size="small" onClick={handleCopyWorkflow} aria-label="复制工作流">
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="解释">
                <IconButton
                  size="small"
                  onClick={(e) => setExplainAnchor(e.currentTarget)}
                  aria-label="解释"
                >
                  <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(explainAnchor)}
                anchorEl={explainAnchor}
                onClose={() => setExplainAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { p: 2, maxWidth: 360, borderRadius: 2 } } }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                  {workflow?.notes && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {workflow.notes}
                    </Typography>
                  )}
                </Stack>
              </Popover>
              {hasVariables && (
                <>
                  <Tooltip title="重置配置">
                    <IconButton size="small" onClick={handleResetConfig} aria-label="重置配置">
                      <RefreshIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="配置">
                    <IconButton size="small" onClick={handleOpenConfig} aria-label="配置">
                      <SettingsOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </Stack>
          <div className="workflow-container">
            {item.steps.map((step) => {
              const fullStep = workflow?.steps.find((s) => s.command === step.command);
              const displayCommand = substituteCommand(step.command, snapshot);
              return (
                <CommandCard
                  key={step.command}
                  command={displayCommand}
                  explanation={step.description}
                  onCopy={onCopyCommand}
                  variables={fullStep?.variables}
                  optional={fullStep?.optional}
                  dangerous={fullStep?.dangerous}
                />
              );
            })}
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
});
