// UI State Management with MobX
import { makeAutoObservable } from 'mobx';

export class UIStore {
  // Command Palette state
  isCommandPaletteOpen = false;

  // Search state
  searchQuery = '';

  // Modal states
  isSettingsModalOpen = false;
  isAboutModalOpen = false;

  // Theme state
  isDarkMode = false;

  // Loading states
  isLoading = false;
  loadingMessage = '';

  // Toast/Notification state
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' | 'warning' = 'info';
  showToast = false;

  // Deep link: 选中 Scenario 后高亮并滚动到的卡片 id (workflow id)
  highlightScenarioId: string | null = null;

  // 场景配置弹窗：当前打开的 workflow id，null 表示关闭
  workflowConfigWorkflowId: string | null = null;

  // 全局命令解释浮层（无遮罩）：悬停 1s 或点击 (i) 触发
  commandExplanation: {
    command: string;
    explanation: string;
    variables?: string[];
    optional?: boolean;
    dangerous?: boolean;
    anchor: { x: number; y: number };
    openBy: 'hover' | 'click';
  } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Command Palette actions
  openCommandPalette() {
    this.isCommandPaletteOpen = true;
  }

  closeCommandPalette() {
    this.isCommandPaletteOpen = false;
    this.searchQuery = '';
  }

  toggleCommandPalette() {
    this.isCommandPaletteOpen = !this.isCommandPaletteOpen;
    if (!this.isCommandPaletteOpen) {
      this.searchQuery = '';
    }
  }

  // Search actions
  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  clearSearch() {
    this.searchQuery = '';
  }

  // Modal actions
  openSettingsModal() {
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.isSettingsModalOpen = false;
  }

  openAboutModal() {
    this.isAboutModalOpen = true;
  }

  closeAboutModal() {
    this.isAboutModalOpen = false;
  }

  // Theme actions
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  setTheme(isDark: boolean) {
    this.isDarkMode = isDark;
  }

  // Loading actions
  startLoading(message = 'Loading...') {
    this.isLoading = true;
    this.loadingMessage = message;
  }

  stopLoading() {
    this.isLoading = false;
    this.loadingMessage = '';
  }

  // Toast actions
  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
  }

  showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
  }

  showInfoToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'info';
    this.showToast = true;
  }

  showWarningToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'warning';
    this.showToast = true;
  }

  hideToast() {
    this.showToast = false;
  }

  setHighlightScenarioId(id: string | null) {
    this.highlightScenarioId = id;
  }

  clearHighlightScenarioId() {
    this.highlightScenarioId = null;
  }

  openWorkflowConfig(workflowId: string) {
    this.workflowConfigWorkflowId = workflowId;
  }

  closeWorkflowConfig() {
    this.workflowConfigWorkflowId = null;
  }

  showCommandExplanation(data: {
    command: string;
    explanation: string;
    variables?: string[];
    optional?: boolean;
    dangerous?: boolean;
    anchor: { x: number; y: number };
    openBy: 'hover' | 'click';
  }) {
    this.commandExplanation = data;
  }

  hideCommandExplanation() {
    this.commandExplanation = null;
  }

  hideCommandExplanationIfFromHover() {
    if (this.commandExplanation?.openBy === 'hover') {
      this.commandExplanation = null;
    }
  }

  // Reset all UI state
  reset() {
    this.isCommandPaletteOpen = false;
    this.searchQuery = '';
    this.isSettingsModalOpen = false;
    this.isAboutModalOpen = false;
    this.isLoading = false;
    this.loadingMessage = '';
    this.showToast = false;
    this.highlightScenarioId = null;
    this.workflowConfigWorkflowId = null;
    this.commandExplanation = null;
  }
}

// Create singleton instance
export const uiStore = new UIStore();
