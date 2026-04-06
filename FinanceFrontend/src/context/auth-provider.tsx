import React, { useState } from 'react';
import type { AuthContextType, User } from './types/auth-context-type.ts';
import { AuthContext } from './auth-context.ts';


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });

  const setAuth = (auth: { token: string; user: User }): void => {
    setToken(auth.token);
    setUser(auth.user);
    localStorage.setItem('authToken', auth.token);
    localStorage.setItem('user', JSON.stringify(auth.user));
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token,
    setAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
