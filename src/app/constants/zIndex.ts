// Z-Index 策略 (specs/UIUX.md §2.2) - 防止遮挡与层级混乱

export const Z_INDEX = {
  CONTENT: 1,
  DROPDOWN: 1000,
  STICKY_HEADER: 1100,
  MODAL: 1300,
  COMMAND_PALETTE: 1300,
  CURSOR: 9000,
  TOAST: 9999,
  // 兼容旧引用
  HEADER: 1100,
  BASE: 0,
  POPOVER: 1000,
  SIDEBAR: 250,
  DRAWER: 400,
  BACKDROP: 450,
  DIALOG: 1300,
  SEARCH_OVERLAY: 1300,
  SNACKBAR: 9999,
  TOOLTIP: 1000,
  MAXIMUM: 9999,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
