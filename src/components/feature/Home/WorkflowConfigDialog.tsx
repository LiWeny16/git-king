import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUIStore, useVariableStore } from '../../../store';
import { getWorkflowById } from '../../../app/data/workflows';
import { copyWorkflowSteps } from '../../../app/utils/clipboard';
import { substituteCommand } from '../../../app/utils/substituteCommand';
import type { WorkflowStep } from '../../../app/data/workflows';

const VARIABLE_LABELS: Record<string, string> = {
  'Your Name': '用户名',
  'you@example.com': '邮箱',
  '<url>': '仓库 URL',
  '<repository-name>': '仓库目录名',
  '<branch-name>': '分支名',
  message: '提交信息',
  description: '描述',
  '<file>': '文件路径',
  '<commit>': '提交 hash',
  '<n>': '提交数量',
  '<version>': '版本号',
  '<issue>': '问题/描述',
  '<feature-branch>': '功能分支名',
};

function getUniqueVariables(steps: WorkflowStep[]): string[] {
  const set = new Set<string>();
  for (const step of steps) {
    for (const v of step.variables ?? []) {
      set.add(v);
    }
  }
  return Array.from(set);
}

export const WorkflowConfigDialog = observer(function WorkflowConfigDialog() {
  const uiStore = useUIStore();
  const variableStore = useVariableStore();
  const workflowId = uiStore.workflowConfigWorkflowId;
  const workflow = workflowId ? getWorkflowById(workflowId) : null;

  const variables = workflow ? getUniqueVariables(workflow.steps) : [];
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workflow) {
      const vars = getUniqueVariables(workflow.steps);
      const initial: Record<string, string> = {};
      for (const v of vars) {
        initial[v] = variableStore.getVariable(v) ?? '';
      }
      setValues(initial);
    }
  }, [workflow, variableStore]);

  const handleClose = () => uiStore.closeWorkflowConfig();

  const handleChange = (placeholder: string, value: string) => {
    setValues((prev) => ({ ...prev, [placeholder]: value }));
  };

  const handleConfirm = () => {
    if (!workflow) return;
    for (const [placeholder, value] of Object.entries(values)) {
      if (value.trim() !== '') variableStore.setVariable(placeholder, value.trim());
    }
    const steps = workflow.steps.map((step) => ({
      command: substituteCommand(step.command, values),
      description: step.description,
    }));
    copyWorkflowSteps(steps).then(() => {
      uiStore.showSuccessToast(`已保存配置并复制工作流: ${workflow.title}`);
      handleClose();
    });
  };

  if (!workflow) return null;

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {workflow.title} — 配置
        <IconButton size="small" onClick={handleClose} aria-label="关闭">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ overflow: 'auto' }}>
        <Stack spacing={2} sx={{ pt: 0.5, minWidth: 0 }}>
          {variables.map((placeholder) => (
            <TextField
              key={placeholder}
              label={VARIABLE_LABELS[placeholder] ?? placeholder}
              placeholder={placeholder}
              value={values[placeholder] ?? ''}
              onChange={(e) => handleChange(placeholder, e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              slotProps={{
                htmlInput: { 'aria-label': VARIABLE_LABELS[placeholder] ?? placeholder },
              }}
              sx={{
                minWidth: 0,
                '& .MuiInputBase-root': { minWidth: 0 },
                '& .MuiInputBase-input': { overflow: 'hidden', textOverflow: 'ellipsis' },
              }}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>取消</Button>
        <Button variant="contained" onClick={handleConfirm}>
          确认并复制工作流
        </Button>
      </DialogActions>
    </Dialog>
  );
});
