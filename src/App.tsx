import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { MainLayout } from './components/layout';
import { CommandPalette, CommandExplanationPopover } from './components/common/Command';
import { SettingsModal } from './components/feature/Settings';
import { HomePage, WorkflowConfigDialog } from './components/feature/Home';
import { useUIStore } from './store';
import { initializeShortcuts, useShortcut } from './app/utils/shortcuts';

const App = observer(function App() {
  const uiStore = useUIStore();

  useEffect(() => {
    return initializeShortcuts();
  }, []);

  useShortcut('openCommandPalette', () => {
    uiStore.toggleCommandPalette();
  });

  return (
    <MainLayout showSidebar={false} showHeader>
      <CommandPalette />
      <CommandExplanationPopover />
      <SettingsModal />
      <WorkflowConfigDialog />
      <HomePage />
    </MainLayout>
  );
});

App.displayName = 'App';

export default App;
