// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import "../../styles/components/layout/sidebar.css";

export default function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const nomeCompleto = user.nome || user.name || "Usuário";

  const menuItems = {
    Candidato: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Vagas", path: "/vagas" },
      { name: "Meu Perfil", path: "/perfil" },
    ],
    Colaborador: [
      // NOVO MENU
      { name: "Dashboard", path: "/dashboard" },
      { name: "Meu Perfil", path: "/perfil" },
      { name: "Meu Ponto", path: "/ponto" },
      { name: "Meus Benefícios", path: "/beneficios" },
      { name: "Minhas Avaliações", path: "/avaliacoes" },
      { name: "Treinamentos", path: "/treinamentos" },
      { name: "Registro de Ponto", path: "/ponto" },
      { name: "Espelho de Ponto", path: "/espelho-ponto" },
    ],
    RH: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Vagas", path: "/vagas" },
      { name: "Criar Vaga", path: "/vagas/nova" },
      { name: "Colaboradores", path: "/colaboradores" },
      { name: "Logs", path: "/logs" },
      { name: 'Espelho de Ponto (Equipe)', path: '/espelho-ponto' },
    ],
    Gestor: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Vagas", path: "/vagas" },
      { name: "Minha Equipe", path: "/equipe" },
      { name: "Avaliações", path: "/avaliacoes" },
      { name: "Logs", path: "/logs" },
    ],
    Admin: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Nova Empresa", path: "/empresas/nova" },
      { name: "Usuários", path: "/usuarios" },
      { name: "Configurações", path: "/configuracoes" },
      { name: "Logs", path: "/logs" },
    ],
    Auditor: [
      // NOVO MENU READ-ONLY
      { name: "Dashboard", path: "/dashboard" },
      { name: "Logs de Auditoria", path: "/logs" },
      { name: "Relatórios Compliance", path: "/relatorios/compliance" },
    ],
  };

  const itensDoMenu = menuItems[user.role] || menuItems.Candidato;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-profile">
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
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </div>
    </aside>
  );
}
