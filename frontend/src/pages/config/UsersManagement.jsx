// src/pages/config/UsersManagement.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/config/usersManagement.css";

export default function UsersManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  const token = localStorage.getItem("nexum_token");
  const apiBase = "http://localhost:8000";

  const fetchWithToken = async (endpoint, options = {}) => {
    if (!token) throw new Error("Token não encontrado");
    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Erro ${response.status}`);
    }
    return response.json();
  };

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithToken("/admin/users");
      setUsuarios(data);
    } catch (err) {
      console.error("[UsersManagement] Erro:", err);
      toast.error(err.message || "Falha ao carregar usuários");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleMudarRole = async (id, novoRole) => {
    if (!novoRole) return;
    if (novoRole === usuarios.find(u => u.id === id)?.role) return;

    if (!window.confirm(`Alterar role para ${novoRole}?`)) return;

    try {
      await fetchWithToken(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ new_role: novoRole }),
      });
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, role: novoRole } : u));
      toast.success(`Role atualizado para ${novoRole}`);
    } catch (err) {
      toast.error(err.message || "Falha ao alterar role");
    }
  };

  const handleExcluir = async (id, nome) => {
    if (id === user.id) {
      toast.error("Você não pode excluir sua própria conta aqui.");
      return;
    }

    if (!window.confirm(`Excluir usuário ${nome}? Essa ação é irreversível.`)) return;

    try {
      await fetchWithToken(`/admin/users/${id}`, { method: "DELETE" });
      setUsuarios(usuarios.filter(u => u.id !== id));
      toast.success("Usuário excluído com sucesso");
    } catch (err) {
      toast.error(err.message || "Falha ao excluir usuário");
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    [u.nome, u.email, u.role, u.cargo || "", u.departamento || ""].some(field =>
      field.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  if (loading) return <div className="loading">Carregando usuários...</div>;
  if (error) return (
    <div className="error">
      Erro: {error}
      <button onClick={loadUsuarios}>Tentar novamente</button>
    </div>
  );

  return (
    <main className="users-management-container">
      <div className="header">
        <h1>Usuários e Permissões</h1>
        <p>Administrador: {user?.nome} • Controle total de acesso</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filtrar por nome, e-mail, role, cargo ou departamento..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Role</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-results">
                Nenhum usuário encontrado com o filtro aplicado.
              </td>
            </tr>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`role-badge ${usuario.role.toLowerCase()}`}>
                    {usuario.role}
                  </span>
                </td>
                <td>{usuario.cargo || "-"}</td>
                <td>{usuario.departamento || "-"}</td>
                <td className="actions">
                  <select
                    onChange={(e) => handleMudarRole(usuario.id, e.target.value)}
                    defaultValue={usuario.role}
                  >
                    <option value="" disabled>Alterar role</option>
                    <option value="CANDIDATO">CANDIDATO</option>
                    <option value="COLABORADOR">COLABORADOR</option>
                    <option value="GESTOR">GESTOR</option>
                    <option value="RH">RH</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="AUDITOR">AUDITOR</option>
                  </select>

                  <button
                    className="btn-delete"
                    onClick={() => handleExcluir(usuario.id, usuario.nome)}
                    disabled={usuario.id === user.id}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Botão Novo Usuário Interno depois da tabela */}
      <div className="actions-bottom">
        <button className="btn-new" onClick={() => navigate("/admin/users/novo")}>
          + Novo Usuário Interno
        </button>
      </div>
    </main>
  );
}