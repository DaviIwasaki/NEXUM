// src/pages/config/UsersManagement.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/config/usersManagement.css";

const mockUsuarios = [
  { id: 101, nome: "Mariana Oliveira", email: "mariana@candidato.com", role: "Candidato" },
  { id: 201, nome: "Ana Souza", email: "ana@rh.com", role: "RH" },
  { id: 301, nome: "Carlos Lima", email: "carlos@gestor.com", role: "Gestor" },
  { id: 401, nome: "Admin Master", email: "admin@nexum.com", role: "Admin" },
  { id: 501, nome: "João Silva", email: "joao@empresa.com", role: "Colaborador" },
  { id: 601, nome: "Laura Mendes", email: "laura@auditor.com", role: "Auditor" },
  { id: 502, nome: "Maria Oliveira", email: "maria@empresa.com", role: "Colaborador" },
  { id: 302, nome: "Pedro Santos", email: "pedro@gestor.com", role: "Gestor" },
];

const rolesDisponiveis = ["Candidato", "Colaborador", "Gestor", "RH", "Admin", "Auditor"];

export default function UsersManagement() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [editandoId, setEditandoId] = useState(null);
  const [novoRole, setNovoRole] = useState("");

  const handleMudarRole = (id) => {
    if (!novoRole) {
      toast.error("Selecione um novo role.");
      return;
    }

    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, role: novoRole } : u
    ));

    const usuarioAlterado = usuarios.find(u => u.id === id);
    console.log("Role alterado por:", user?.nome, "para usuário:", usuarioAlterado?.nome, "novo role:", novoRole);

    toast.success(`Role de ${usuarioAlterado?.nome} alterado para ${novoRole}`);

    setEditandoId(null);
    setNovoRole("");
  };

  return (
    <main className="users-management-container">
      <div className="header">
        <h1>Usuários e Permissões</h1>
        <p>Administrador: {user?.nome} • Controle total de acesso</p>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Role Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>
                <span className="role-badge">{usuario.role}</span>
              </td>
              <td>
                {editandoId === usuario.id ? (
                  <div className="edit-role">
                    <select value={novoRole} onChange={(e) => setNovoRole(e.target.value)}>
                      <option value="">Selecione novo role</option>
                      {rolesDisponiveis.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <button onClick={() => handleMudarRole(usuario.id)}>Salvar</button>
                    <button onClick={() => { setEditandoId(null); setNovoRole(""); }}>Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => { setEditandoId(usuario.id); setNovoRole(usuario.role); }}>
                    Editar Role
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}