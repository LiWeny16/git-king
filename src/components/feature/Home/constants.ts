import type { ComponentType } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryIcon from '@mui/icons-material/History';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import type { Variants } from 'framer-motion';

// specs/UIUX.md §4.1: Spring stiffness 400, damping 30
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
  },
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// 深度链接滚动时减去的高度 (specs/UIUX.md §3.1)
export const HEADER_SCROLL_OFFSET = 80 + 20;

export const scenarioSectionIcons: Record<string, ComponentType<{ sx?: object }>> = {
  '初始化与配置': SettingsIcon,
  '分支与协作': AccountTreeIcon,
  '提交与撤销': HistoryIcon,
  '临时保存与恢复': BookmarkBorderIcon,
};
