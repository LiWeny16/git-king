// 将 uiStore 的 toast 桥接到 sonner (specs/UIUX.md §4.3)
import { useEffect } from 'react';
import { toast } from 'sonner';
import { observer } from 'mobx-react-lite';
import { useUIStore } from '../../../store';

export const ToastBridge = observer(function ToastBridge() {
  const uiStore = useUIStore();

  useEffect(() => {
    if (!uiStore.showToast) return;
    const msg = uiStore.toastMessage;
    const type = uiStore.toastType;
    uiStore.hideToast();
    if (type === 'success') toast.success(msg);
    else if (type === 'error') toast.error(msg);
    else if (type === 'warning') toast.warning(msg);
    else toast.info(msg);
  }, [uiStore.showToast, uiStore.toastMessage, uiStore.toastType, uiStore]);

  return null;
});
