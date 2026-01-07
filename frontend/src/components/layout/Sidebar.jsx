import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import '../../styles/components/layout/sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null; // não mostra se não logado

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
      { name: 'Cadastro de Vaga', path: '/vagas/nova' },
      { name: 'Processos Seletivos', path: '/processoSeletivo' },
      { name: 'Histórico / Logs', path: '/logs' },
    ],
    Gestor: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Vagas', path: '/vagas' },
      { name: 'Processos Seletivos', path: '/processoSeletivo' },
      { name: 'Histórico / Logs', path: '/logs' },
    ],
    Admin: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Empresas', path: '/empresas' },
      { name: 'Usuários', path: '/usuarios' },
      { name: 'Vagas', path: '/vagas' },
      { name: 'Logs', path: '/logs' },
    ],
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-profile">
        <div className="avatar-placeholder">{user.name[0]}</div>
        <div className="profile-info">
          <span className="profile-name">{user.name}</span>
          <span className="profile-role">{user.role}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems[user.role].map((item) => (
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