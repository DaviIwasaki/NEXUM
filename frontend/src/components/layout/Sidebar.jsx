// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';
import '../../styles/components/layout/sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();

  // Não mostra sidebar se não estiver logado
  if (!user) return null;

  // Padronizei tudo para usar "nome" (com "o")
  const nomeCompleto = user.nome || user.name || "Usuário";

  // Menu por papel
  const menuItems = {
    Candidato: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Vagas', path: '/vagas' },
      { name: 'Perfil', path: '/perfil' },
    ],
    RH: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Vagas', path: '/vagas' },
      { name: 'Criar Vaga', path: '/vagas/nova' },
      { name: 'Histórico / Logs', path: '/logs' },
    ],
    Gestor: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Vagas', path: '/vagas' },
      { name: 'Processos Seletivos', path: '/processo/1' }, // exemplo, depois pode ser lista
      { name: 'Histórico / Logs', path: '/logs' },
    ],
    Admin: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Nova Empresa', path: '/empresas/nova' },
      { name: 'Vagas', path: '/vagas' },
      { name: 'Logs', path: '/logs' },
    ],
  };

  const itensDoMenu = menuItems[user.role] || menuItems.Candidato;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-profile">
        {/* Agora seguro: pega a primeira letra do nome */}
        <div className="avatar-placeholder">
          {nomeCompleto.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <span className="profile-name">{nomeCompleto}</span>
          <span className="profile-role">{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {itensDoMenu.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              isActive ? 'menu-item active' : 'menu-item'
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}