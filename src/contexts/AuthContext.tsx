
/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Handles login, logout, and token storage in localStorage.
 * Uses React Context API for state management.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoginResponse, AuthState } from '../types';
import { useToast } from '../hooks/use-toast';

/**
 * Type definition for the AuthContext
 */
interface AuthContextType {
  auth: AuthState;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
}

/**
 * Initial authentication state - defaults to logged out
 */
const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  protocol: null,
  protocolId: null,
  pId: null,
  userName: null,
  userEmail: null,
};

/**
 * Create the authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app to provide authentication state
 * @param children - Child components that will have access to auth context
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : initialState;
  });
  
  const { toast } = useToast();

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  /**
   * Handle user login and store authentication data
   * @param loginResponse - Response data from login API
   */
  const login = (loginResponse: LoginResponse) => {
    setAuth({
      isAuthenticated: true,
      accessToken: loginResponse.token.accessToken,
      refreshToken: loginResponse.token.refreshToken,
      protocol: loginResponse.protocol.protocol,
      protocolId: loginResponse.protocol.protocolId,
      pId: loginResponse.protocol.pId,
      userName: loginResponse.user.name,
      userEmail: loginResponse.user.email,
    });
    
    toast({
      title: "Login bem-sucedido",
      description: `Bem-vindo, ${loginResponse.user.name}!`,
    });
  };

  /**
   * Handle user logout by clearing auth state
   */
  const logout = () => {
    setAuth(initialState);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context in components
 * @returns Authentication context with state and methods
 * @throws Error if used outside of an AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
