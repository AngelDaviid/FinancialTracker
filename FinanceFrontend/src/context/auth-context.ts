import { createContext } from 'react';
import type { AuthContextType } from './types/auth-context-type.ts';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
