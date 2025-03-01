
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoginResponse, AuthState } from '../types';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  auth: AuthState;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
}

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : initialState;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
