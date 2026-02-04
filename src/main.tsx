import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { theme } from './config/theme'
import { StoreContext, rootStore } from './store'
import { ToastBridge } from './components/common/ToastBridge'

// specs/UIUX.md §4.3: Toast 底部右侧、黑底白字、细微边框
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastBridge />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#1c1c1e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
            },
          }}
        />
      </ThemeProvider>
    </StoreContext.Provider>
  </StrictMode>,
)
