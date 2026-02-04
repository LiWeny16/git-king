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
        variant="caption"
        sx={{
          display: 'block',
          mb: 1,
          color: 'text.secondary',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          px: 2.5,
          py: 1,
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

  // 与 Paper 圆角协调，内容明显内收不贴边（specs 布局约束）
  const contentPadding = 4; // 32px

  return (
    <Dialog
      open={uiStore.isSettingsModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.default',
          maxHeight: '85vh',
          boxShadow: '0px 20px 40px -10px rgba(0, 0, 0, 0.12)',
        },
      }}
      sx={{
        zIndex: Z_INDEX.MODAL,
      }}
    >
      {/* Header：与内容区同宽内收 */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: contentPadding,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {CONFIG.title}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: contentPadding, pt: 2.5, bgcolor: 'background.default' }}>
        {/* AI Configuration */}
        <SettingsSection title={CONFIG.sections.ai}>
          <List disablePadding>
            <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 2, py: 2, px: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KeyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
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
                    borderRadius: 1.5,
                  },
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowToken(!showToken)}
                  sx={{ minWidth: 'auto', px: 1 }}
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
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                配置 API Token 后可启用 AI 增强功能，支持智能问答和命令生成。
              </Typography>
            </ListItem>
          </List>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title={CONFIG.sections.appearance}>
          <List disablePadding sx={{ py: 0.5 }}>
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <DarkModeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <ListItemText
                  primary="深色模式"
                  secondary="切换应用主题"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </Box>
              <ListItemSecondaryAction>
                <Switch
                  checked={uiStore.isDarkMode}
                  onChange={() => uiStore.toggleTheme()}
                  color="primary"
                  size="medium"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <LanguageIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <ListItemText
                  primary="语言"
                  secondary="当前: 简体中文"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </Box>
            </ListItem>
          </List>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title={CONFIG.sections.data}>
          <List disablePadding sx={{ py: 0.5 }}>
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <StorageIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <ListItemText
                  primary="清除本地数据"
                  secondary="删除所有仓库记录和配置"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
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
          borderTop: '1px solid',
          borderColor: 'divider',
          px: contentPadding,
          py: 2,
          gap: 1,
        }}
      >
        <Button onClick={handleClose} variant="contained" color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
});
