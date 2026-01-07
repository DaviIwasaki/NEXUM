import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import '../../styles/components/layout/header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Espaço para futura logo */}
        <div className="logo-placeholder">
          {/* Trocar por <img src="/logo.svg" /> depois */}
          <span>N</span>
        </div>
        <h1 className="app-title">NEXUM</h1>
      </div>

      <nav className="header-nav">
        {user && (
          <>
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