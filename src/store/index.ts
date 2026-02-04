// Central store exports
export { uiStore, UIStore } from './uiStore';
export { gitStore, GitStore } from './gitStore';
export { variableStore, VariableStore } from './variableStore';

// Store context for React
import { createContext, useContext } from 'react';
import { uiStore } from './uiStore';
import { gitStore } from './gitStore';
import { variableStore } from './variableStore';

export interface RootStore {
  uiStore: typeof uiStore;
  gitStore: typeof gitStore;
  variableStore: typeof variableStore;
}

export const rootStore: RootStore = {
  uiStore,
  gitStore,
  variableStore,
};

// React Context
export const StoreContext = createContext<RootStore>(rootStore);

// Custom hook to use stores
export function useStores(): RootStore {
  return useContext(StoreContext);
}

// Individual store hooks
export function useUIStore() {
  const { uiStore } = useStores();
  return uiStore;
}

export function useGitStore() {
  const { gitStore } = useStores();
  return gitStore;
}

export function useVariableStore() {
  const { variableStore } = useStores();
  return variableStore;
}
