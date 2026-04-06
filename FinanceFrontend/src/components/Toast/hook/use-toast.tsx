import { useContext } from 'react';
import { ToastContext } from '../utils/toast-context.ts';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export { useToast };
