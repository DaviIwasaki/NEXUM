// src/components/layout/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';
import '../../styles/components/layout/header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Padroniza o nome
  const nomeUsuario = user?.nome || user?.name || "Usuário";

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-placeholder">
          <span>N</span>
        </div>
        <h1 className="app-title">NEXUM</h1>
      </div>

      <nav className="header-nav">
        {user && (
          <>
            <span className="user-greeting">Olá, {nomeUsuario}</span>
            <span className="user-role">{user.role}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
}