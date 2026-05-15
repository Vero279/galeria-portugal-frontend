import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { strapiAuth } from '../services/strapi';
import type { User, UserRole } from '../lib/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper to safely extract role name from Strapi user object
function getUserRole(strapiUser: any): UserRole {
  // Try to get role from the user object
  if (strapiUser.role && typeof strapiUser.role === 'object' && strapiUser.role.name) {
    const roleName = strapiUser.role.name;
    if (roleName === 'Admin') return 'admin';
    if (roleName === 'Artist') return 'artist';
    if (roleName === 'Customer') return 'customer';
  }
  // If role is a string
  if (typeof strapiUser.role === 'string') {
    if (strapiUser.role === 'Admin') return 'admin';
    if (strapiUser.role === 'Artist') return 'artist';
    if (strapiUser.role === 'Customer') return 'customer';
  }
  // Fallback: try to infer from email domain or custom logic
  // For now, default to customer
  console.warn('User role missing, defaulting to customer', strapiUser);
  return 'customer';
}

const mapStrapiUser = (strapiUser: any): User => {
  return {
    id: String(strapiUser.id),
    email: strapiUser.email,
    name: strapiUser.username,
    role: getUserRole(strapiUser),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('strapi_jwt');
    if (token) {
      strapiAuth.getMe()
        .then(userData => setUser(mapStrapiUser(userData)))
        .catch((err) => {
          console.error('Failed to fetch user', err);
          strapiAuth.logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const result = await strapiAuth.login(email, password);
      const userData = await strapiAuth.getMe();
      setUser(mapStrapiUser(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    strapiAuth.logout();
    setUser(null);
  }, []);

  const value = { user, isAuthenticated: !!user, isLoading, error, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};