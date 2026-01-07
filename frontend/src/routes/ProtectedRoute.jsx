// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Enquanto verifica o login inicial
  if (loading) {
    return (
      <div className="loading-full">
        <p>Carregando sistema...</p>
      </div>
    );
  }

  // Não está logado → vai pro login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Está logado, mas a rota exige papéis específicos
  if (roles && !roles.includes(user.role)) {
    // Redireciona para dashboard (ou poderia ser uma página 403)
    return <Navigate to="/dashboard" replace />;
  }

  // Tudo certo → libera a página
  return children;
};

export default ProtectedRoute;