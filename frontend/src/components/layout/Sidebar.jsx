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
      { name: "Dashboard", path: "/dashboard" },
      { name: "Meu Perfil", path: "/perfil" },
      // Ponto
      { name: "Registro de Ponto", path: "/ponto" },
      { name: "Espelho de Ponto", path: "/espelho-ponto" },
      // Benefícios
      { name: "Catálogo de Benefícios", path: "/beneficios/catalogo" },
      { name: "Meus Benefícios", path: "/meus-beneficios" },
      // Folha
      { name: "Meu Holerite", path: "/holerite" },
      // Treinamento
      { name: "Trilhas de Aprendizagem", path: "/trilhas-aprendizagem" },
      { name: "Histórico de Treinamentos", path: "/historico-treinamentos" },
      // Saúde
      { name: "Solicitações de Saúde", path: "/saude/solicitacoes" },
    ],
    RH: [
      { name: "Dashboard", path: "/dashboard" },
      // Recrutamento
      { name: "Vagas", path: "/vagas" },
      { name: "Criar Vaga", path: "/vagas/nova" },
      { name: "Colaboradores", path: "/colaboradores" },
      // Ponto e Folha
      { name: "Espelho de Ponto (Equipe)", path: "/espelho-ponto" },
      { name: "Cálculo da Folha", path: "/folha-calculo" },
      { name: "Relatórios Fiscais", path: "/relatorios-fiscais" },
      // Benefícios
      { name: "Administração de Benefícios", path: "/beneficios/admin" },
      { name: "Aprovações de Benefícios", path: "/meus-beneficios" },
      // Treinamento
      { name: "Administração T&D", path: "/treinamentos/admin" },
      { name: "Histórico de Treinamentos", path: "/historico-treinamentos" },
      // Relatórios
      { name: "Relatórios Compliance", path: "/relatorios/compliance" },
      { name: "Relatórios Estratégicos", path: "/relatorios/estrategicos" },
      // Auditoria
      { name: "Logs", path: "/logs" },
    ],
    Gestor: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Vagas", path: "/vagas" },
      { name: "Minha Equipe", path: "/colaboradores" },
      { name: "Aprovações Pendentes", path: "/aprovacoes-pendentes" },
      { name: "Ciclos de Avaliação", path: "/ciclos-avaliacao" },
      { name: "Aprovações de Saúde", path: "/saude/solicitacoes" },
      { name: "Relatórios Estratégicos", path: "/relatorios/estrategicos" },
      { name: "Logs", path: "/logs" },
    ],
    ADMIN: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Usuários e Permissões", path: "/config/usuarios" },
      { name: "Cargos e Departamentos", path: "/config/cargos-departamentos" },
      { name: "Relatórios Compliance", path: "/relatorios/compliance" },
      { name: "Relatórios Estratégicos", path: "/relatorios/estrategicos" },
      { name: "Logs", path: "/logs" },
    ],
    Auditor: [
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
            key={item.path} // usei path como key para evitar duplicatas
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
