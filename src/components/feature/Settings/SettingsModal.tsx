// Settings Modal Component - iOS Style
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import { useUIStore, useGitStore } from '../../../store';
import { Z_INDEX } from '../../../app/constants';
import { useState, useEffect } from 'react';

// Configuration
const CONFIG = {
  title: '设置',
  sections: {
    ai: 'AI 配置',
    appearance: '外观',
    data: '数据管理',
  },
};

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="overline"
        sx={{
          display: 'block',
          px: 2,
          py: 1,
          color: 'text.secondary',
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export const SettingsModal = observer(function SettingsModal() {
  const uiStore = useUIStore();
  const gitStore = useGitStore();
  
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Sync token from store
  useEffect(() => {
    if (uiStore.isSettingsModalOpen) {
      setApiToken(gitStore.aiToken);
    }
  }, [uiStore.isSettingsModalOpen, gitStore.aiToken]);

  const handleSaveToken = () => {
    gitStore.setAIToken(apiToken.trim());
    uiStore.showSuccessToast('API Token 已保存');
  };

  const handleClearToken = () => {
    gitStore.clearAIToken();
    setApiToken('');
    uiStore.showInfoToast('API Token 已清除');
  };

  const handleClearData = () => {
    if (window.confirm('确定要清除所有本地数据吗？此操作不可撤销。')) {
      gitStore.reset();
      uiStore.showSuccessToast('本地数据已清除');
    }
  };

  const handleClose = () => {
    uiStore.closeSettingsModal();
  };

  return (
    <Dialog
      open={uiStore.isSettingsModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: 'background.default',
          maxHeight: '80vh',
        },
      }}
      sx={{
        zIndex: Z_INDEX.MODAL,
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {CONFIG.title}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, bgcolor: 'background.default' }}>
        {/* AI Configuration */}
        <SettingsSection title={CONFIG.sections.ai}>
          <List disablePadding>
            <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1.5, py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KeyIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  OpenAI API Token
                </Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                type={showToken ? 'text' : 'password'}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="sk-..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default',
                  },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? '隐藏' : '显示'}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveToken}
                  disabled={!apiToken.trim()}
                >
                  保存
                </Button>
                {gitStore.aiToken && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={handleClearToken}
                  >
                    清除
                  </Button>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                配置 API Token 后可启用 AI 增强功能，支持智能问答和命令生成。
              </Typography>
            </ListItem>
          </List>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title={CONFIG.sections.appearance}>
          <List disablePadding>
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <DarkModeIcon sx={{ color: 'text.secondary' }} />
                <ListItemText
                  primary="深色模式"
                  secondary="切换应用主题"
                />
              </Box>
              <ListItemSecondaryAction>
                <Switch
                  checked={uiStore.isDarkMode}
                  onChange={() => uiStore.toggleTheme()}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <LanguageIcon sx={{ color: 'text.secondary' }} />
                <ListItemText
                  primary="语言"
                  secondary="当前: 简体中文"
                />
              </Box>
            </ListItem>
          </List>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title={CONFIG.sections.data}>
          <List disablePadding>
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <StorageIcon sx={{ color: 'text.secondary' }} />
                <ListItemText
                  primary="清除本地数据"
                  secondary="删除所有仓库记录和配置"
                />
              </Box>
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleClearData}
                >
                  清除
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </SettingsSection>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          px: 3,
          py: 2,
        }}
      >
        <Button onClick={handleClose} variant="text">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
});
