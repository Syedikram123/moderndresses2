import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  adminEmail: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'md_admin_auth_session';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('md_admin_email') || 'admin@moderndresses.com';
  });

  const login = (email: string, pass: string): boolean => {
    // Demo credentials check
    if (email.trim().toLowerCase() === 'admin@moderndresses.com' && pass === 'admin123') {
      setIsAuthenticated(true);
      setAdminEmail(email);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem('md_admin_email', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('md_admin_email');
  };

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(localStorage.getItem(AUTH_STORAGE_KEY) === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, adminEmail }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
