import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { User, AuthCredentials, RegistrationData } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegistrationData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const foundUser = MOCK_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (foundUser) {
        const { password, ...userData } = foundUser;
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, error: 'Invalid username or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const register = useCallback(async (data: RegistrationData): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!data.username || !data.password || !data.email || !data.name) {
        return { success: false, error: 'All fields are required' };
      }
      
      if (MOCK_USERS.some(u => u.username === data.username)) {
        return { success: false, error: 'Username already exists' };
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        username: data.username,
        email: data.email,
        name: data.name,
        profileImage: 'https://via.placeholder.com/150',
      };
      
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};