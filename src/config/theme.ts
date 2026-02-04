import { createTheme, alpha } from '@mui/material/styles';

// Design Tokens: Cupertino Industrial (specs/UIUX.md) - Apple + GitHub 语义色
const IOS_TOKENS = {
  // Semantic Colors - Light (Dark in darkTheme)
  colors: {
    primary: '#007AFF', // Apple Blue / accent-primary
    secondary: '#8250DF',
    success: '#1A7F37',
    warning: '#9A6700',
    error: '#CF222E',
    info: '#007AFF',
    background: {
      primary: '#F5F5F7', // bg-canvas (Apple Gray)
      secondary: '#FFFFFF', // bg-surface
      tertiary: '#F6F8FA',
    },
    codeBlock: '#F6F8FA', // code-bg
    codeBlockBorder: 'rgba(31, 35, 40, 0.12)',
    text: {
      primary: '#1D1D1F', // Off-Black
      secondary: '#86868B',
      tertiary: '#8C959F',
    },
    separator: 'rgba(0, 0, 0, 0.08)', // border-subtle
    fill: {
      primary: 'rgba(0, 0, 0, 0.08)',
      secondary: 'rgba(0, 0, 0, 0.06)',
      tertiary: 'rgba(0, 0, 0, 0.04)',
    },
  },
  // Typography - SF Pro Text, Inter; Body 15px / 1.5
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "PingFang SC", "Microsoft YaHei", sans-serif',
    largeTitle: {
      fontSize: '34px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '0.37px',
    },
    title1: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '0.36px',
    },
    title2: {
      fontSize: '22px',
      fontWeight: 700,
      lineHeight: 1.27,
      letterSpacing: '0.35px',
    },
    title3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '0.38px',
    },
    headline: {
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: 1.29,
      letterSpacing: '-0.41px',
    },
    body: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: 1.29,
      letterSpacing: '-0.41px',
    },
    callout: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.31,
      letterSpacing: '-0.32px',
    },
    subheadline: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '-0.24px',
    },
    footnote: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.38,
      letterSpacing: '-0.08px',
    },
    caption1: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0px',
    },
    caption2: {
      fontSize: '11px',
      fontWeight: 400,
      lineHeight: 1.18,
      letterSpacing: '0.07px',
    },
  },
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
  },
  // Border Radius — iOS 风格，卡片 16
  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  // Shadow Elevation (Level 1 Card, Level 2 Hover, Level 3 Modal)
  shadows: {
    sm: '0px 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0px 20px 40px -10px rgba(0, 0, 0, 0.15)',
  },
  // Backdrop Blur
  backdrop: {
    regular: 'blur(20px)',
    thick: 'blur(30px)',
    thin: 'blur(10px)',
  },
};

// Create MUI Theme with iOS Style
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: IOS_TOKENS.colors.primary,
      light: alpha(IOS_TOKENS.colors.primary, 0.15),
      dark: '#0550AE',
    },
    secondary: {
      main: IOS_TOKENS.colors.secondary,
    },
    success: {
      main: IOS_TOKENS.colors.success,
    },
    warning: {
      main: IOS_TOKENS.colors.warning,
    },
    error: {
      main: IOS_TOKENS.colors.error,
    },
    info: {
      main: IOS_TOKENS.colors.info,
    },
    background: {
      default: IOS_TOKENS.colors.background.primary,
      paper: IOS_TOKENS.colors.background.secondary,
    },
    text: {
      primary: IOS_TOKENS.colors.text.primary,
      secondary: IOS_TOKENS.colors.text.secondary,
    },
    divider: IOS_TOKENS.colors.separator,
  },
  typography: {
    fontFamily: IOS_TOKENS.typography.fontFamily,
    h1: IOS_TOKENS.typography.largeTitle,
    h2: IOS_TOKENS.typography.title1,
    h3: IOS_TOKENS.typography.title2,
    h4: IOS_TOKENS.typography.title3,
    h5: IOS_TOKENS.typography.headline,
    h6: IOS_TOKENS.typography.headline,
    body1: IOS_TOKENS.typography.body,
    body2: IOS_TOKENS.typography.callout,
    subtitle1: IOS_TOKENS.typography.subheadline,
    subtitle2: IOS_TOKENS.typography.footnote,
    caption: IOS_TOKENS.typography.caption1,
    overline: IOS_TOKENS.typography.caption2,
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '17px',
      letterSpacing: '-0.41px',
    },
  },
  shape: {
    borderRadius: IOS_TOKENS.borderRadius.lg, // 16 - iOS 风格
  },
  spacing: 4,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: IOS_TOKENS.colors.background.primary,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 4,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: alpha(IOS_TOKENS.colors.primary, 0.08),
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#0062CC',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: IOS_TOKENS.colors.fill.tertiary,
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: IOS_TOKENS.borderRadius.lg,
          boxShadow: IOS_TOKENS.shadows.sm,
          border: `1px solid ${IOS_TOKENS.colors.separator}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${IOS_TOKENS.colors.separator}`,
        },
        rounded: {
          borderRadius: IOS_TOKENS.borderRadius.lg,
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 11,
          paddingBottom: 11,
          minHeight: 44,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: IOS_TOKENS.borderRadius.md,
          '&:hover': {
            backgroundColor: IOS_TOKENS.colors.fill.tertiary,
          },
          '&:active': {
            backgroundColor: IOS_TOKENS.colors.fill.secondary,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: IOS_TOKENS.colors.separator,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: IOS_TOKENS.borderRadius.md,
            backgroundColor: IOS_TOKENS.colors.fill.tertiary,
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: `2px solid ${IOS_TOKENS.colors.primary}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: IOS_TOKENS.borderRadius.md,
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: IOS_TOKENS.backdrop.regular,
          borderRadius: IOS_TOKENS.borderRadius.sm,
          fontSize: '13px',
          padding: '8px 12px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: IOS_TOKENS.borderRadius.xl,
          boxShadow: IOS_TOKENS.shadows.lg,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: IOS_TOKENS.borderRadius.md,
          '&:hover': {
            backgroundColor: IOS_TOKENS.colors.fill.tertiary,
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
  },
});

// 代码块等宽字体栈 (GitHub / SF Mono)
export const MONOSPACE_FONT = '"SF Mono", "JetBrains Mono", "Fira Code", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Export tokens for custom usage
export { IOS_TOKENS };

// Dark Theme variant (GitHub Dark + accent-primary #58A6FF)
export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#58A6FF',
      light: alpha('#58A6FF', 0.2),
      dark: '#79B8FF',
    },
    secondary: {
      main: '#5E5CE6',
    },
    success: {
      main: '#30D158',
    },
    warning: {
      main: '#FF9F0A',
    },
    error: {
      main: '#FF453A',
    },
    info: {
      main: '#64D2FF',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
    },
    divider: 'rgba(240, 246, 252, 0.1)',
  },
});
