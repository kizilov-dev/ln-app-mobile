import React, { createContext, useContext, useState } from 'react';
import { tokenStorage } from '../utils/tokenStorage';

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async (token: string) => {
    await tokenStorage.save(token);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await tokenStorage.remove();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 