import { useContext } from 'react';
import { AuthContext } from '../auth-context.ts';
import type { AuthContextType } from '../types/auth-context-type.ts';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export { useAuth };
