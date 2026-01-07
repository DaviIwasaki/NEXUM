// src/store/AuthStore.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a página, verifica se já tem usuário logado (token + user no localStorage)
  useEffect(() => {
    const token = localStorage.getItem('nexum_token');
    const savedUser = localStorage.getItem('nexum_user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao parsear usuário salvo:', error);
        localStorage.removeItem('nexum_token');
        localStorage.removeItem('nexum_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token = 'fake-jwt-token') => {
    // Em produção aqui viria o token real do backend
    localStorage.setItem('nexum_token', token);
    localStorage.setItem('nexum_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('nexum_token');
    localStorage.removeItem('nexum_user');
    setUser(null);
  };

  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData };
    localStorage.setItem('nexum_user', JSON.stringify(updated));
    setUser(updated);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};