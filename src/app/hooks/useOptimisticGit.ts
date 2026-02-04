// Optimistic UI Hook for Git operations
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Configuration
const CONFIG = {
  toastDuration: 3000,
  rollbackDelay: 500,
};

// Types
export interface OptimisticState<T> {
  data: T;
  isLoading: boolean;
  isOptimistic: boolean;
  error: Error | null;
}

interface UseOptimisticGitOptions<T> {
  initialData: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error, rollbackData: T) => void;
}

interface OptimisticOperation<T> {
  execute: (optimisticData: T, asyncFn: () => Promise<T>) => Promise<void>;
  reset: () => void;
  setData: (data: T) => void;
}

/**
 * Custom hook for optimistic UI updates with rollback capability
 * 
 * @example
 * const { state, execute } = useOptimisticGit({ initialData: [] });
 * 
 * // Optimistically add item, then sync with server
 * await execute(
 *   [...state.data, newItem],  // Optimistic state
 *   () => api.addItem(newItem)  // Actual async operation
 * );
 */
export function useOptimisticGit<T>(
  options: UseOptimisticGitOptions<T>
): { state: OptimisticState<T> } & OptimisticOperation<T> {
  const { initialData, onSuccess, onError } = options;

  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isLoading: false,
    isOptimistic: false,
    error: null,
  });

  const execute = useCallback(
    async (optimisticData: T, asyncFn: () => Promise<T>) => {
      // Store previous data for rollback
      const previousData = state.data;

      // Apply optimistic update immediately
      setState((prev) => ({
        ...prev,
        data: optimisticData,
        isLoading: true,
        isOptimistic: true,
        error: null,
      }));

      try {
        // Execute the actual async operation
        const result = await asyncFn();

        // Success - update with actual data
        setState((prev) => ({
          ...prev,
          data: result,
          isLoading: false,
          isOptimistic: false,
          error: null,
        }));

        onSuccess?.(result);
        toast.success('Operation completed successfully', {
          duration: CONFIG.toastDuration,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');

        // Rollback to previous state
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            data: previousData,
            isLoading: false,
            isOptimistic: false,
            error,
          }));
        }, CONFIG.rollbackDelay);

        onError?.(error, previousData);
        toast.error(`Operation failed: ${error.message}`, {
          duration: CONFIG.toastDuration,
        });
      }
    },
    [state.data, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      isOptimistic: false,
      error: null,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState((prev) => ({
      ...prev,
      data,
      isOptimistic: false,
    }));
  }, []);

  return {
    state,
    execute,
    reset,
    setData,
  };
}

/**
 * Simplified hook for single value optimistic updates
 */
export function useOptimisticValue<T>(initialValue: T) {
  return useOptimisticGit({ initialData: initialValue });
}

/**
 * Hook for optimistic list operations (add, remove, update)
 */
export function useOptimisticList<T extends { id: string }>(initialItems: T[] = []) {
  const { state, execute, reset, setData } = useOptimisticGit({
    initialData: initialItems,
  });

  const addItem = useCallback(
    async (item: T, asyncFn: () => Promise<T[]>) => {
      await execute([...state.data, item], asyncFn);
    },
    [state.data, execute]
  );

  const removeItem = useCallback(
    async (id: string, asyncFn: () => Promise<T[]>) => {
      await execute(
        state.data.filter((item) => item.id !== id),
        asyncFn
      );
    },
    [state.data, execute]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<T>, asyncFn: () => Promise<T[]>) => {
      await execute(
        state.data.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        asyncFn
      );
    },
    [state.data, execute]
  );

  return {
    items: state.data,
    isLoading: state.isLoading,
    isOptimistic: state.isOptimistic,
    error: state.error,
    addItem,
    removeItem,
    updateItem,
    reset,
    setItems: setData,
  };
}
