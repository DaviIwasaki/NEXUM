// src/pages/AuditLog.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/auditLog.css";

export default function AuditLog() {
  const { user } = useAuth();
  
  const [logs, setLogs] = useState([]);
  const [filtros, setFiltros] = useState({
    role: "",
    evento: "",
    dataInicio: "",
    dataFim: "",
    usuario: "",
  });
  const [logSelecionado, setLogSelecionado] = useState(null);

  // Mock expandido com mais eventos e roles
  useEffect(() => {
    const mockLogsExpandidos = [
      { id: 1, data: "2026-01-08 18:15", usuario: "Ana Souza", role: "RH", evento: "CREATE_JOB", detalhes: "Criou vaga 'Desenvolvedor Frontend Pleno'", ip: "192.168.1.105" },
      { id: 2, data: "2026-01-08 17:40", usuario: "Carlos Lima", role: "Gestor", evento: "MOVE_CANDIDATE", detalhes: "Moveu João Silva para 'Entrevista Técnica'", ip: "192.168.1.110" },
      { id: 3, data: "2026-01-08 16:20", usuario: "Mariana Oliveira", role: "Candidato", evento: "APPLY_JOB", detalhes: "Candidatou-se à vaga 'Analista de Dados'", ip: "200.100.50.25" },
      { id: 4, data: "2026-01-08 14:55", usuario: "João Silva", role: "Colaborador", evento: "REGISTER_POINT", detalhes: "Registro de entrada às 08:00", ip: "192.168.1.120" },
      { id: 5, data: "2026-01-08 13:30", usuario: "Admin Master", role: "Admin", evento: "CREATE_COMPANY", detalhes: "Cadastrou empresa 'Nova Tech Ltda'", ip: "192.168.1.1" },
      { id: 6, data: "2026-01-08 11:10", usuario: "Ana Souza", role: "RH", evento: "APPROVE_BENEFIT", detalhes: "Aprovou adesão ao Plano de Saúde para Pedro Santos", ip: "192.168.1.105" },
      { id: 7, data: "2026-01-08 09:45", usuario: "Carlos Lima", role: "Gestor", evento: "APPROVE_HEALTH_REQUEST", detalhes: "Aprovou atestado médico de Maria Oliveira", ip: "192.168.1.110" },
      { id: 8, data: "2026-01-07 20:00", usuario: "João Silva", role: "Colaborador", evento: "SUBMIT_EVALUATION", detalhes: "Submeteu autoavaliação do ciclo 1/2026", ip: "192.168.1.120" },
      { id: 9, data: "2026-01-07 15:20", usuario: "Admin Master", role: "Admin", evento: "CHANGE_USER_ROLE", detalhes: "Alterou role de Mariana Oliveira para Colaborador", ip: "192.168.1.1" },
      { id: 10, data: "2026-01-07 10:05", usuario: "Laura Mendes", role: "Auditor", evento: "VIEW_COMPLIANCE_REPORT", detalhes: "Visualizou relatório LGPD completo", ip: "192.168.1.200" },
    ];
    setLogs(mockLogsExpandidos);
  }, []);

  const rolesUnicos = ["RH", "Gestor", "Admin", "Colaborador", "Candidato", "Auditor"];
  const eventosUnicos = [...new Set(logs.map(log => log.evento))];

  const logsFiltrados = logs.filter((log) => {
    if (filtros.role && log.role !== filtros.role) return false;
    if (filtros.evento && log.evento !== filtros.evento) return false;
    if (filtros.usuario && !log.usuario.toLowerCase().includes(filtros.usuario.toLowerCase())) return false;
    if (filtros.dataInicio && new Date(log.data) < new Date(filtros.dataInicio)) return false;
    if (filtros.dataFim && new Date(log.data) > new Date(filtros.dataFim + "T23:59:59")) return false;
    return true;
  });

  return (
    <main className="audit-log-page">
      <header className="audit-log-header">
        <h1>Audit Log Expandido</h1>
        <p>Registro completo de ações • Acesso: {user?.role} ({user?.nome})</p>
      </header>

      <section className="audit-filters advanced">
        <div className="filter-group">
          <label>Role do Usuário</label>
          <select value={filtros.role} onChange={(e) => setFiltros({ ...filtros, role: e.target.value })}>
            <option value="">Todos os roles</option>
            {rolesUnicos.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Tipo de Evento</label>
          <select value={filtros.evento} onChange={(e) => setFiltros({ ...filtros, evento: e.target.value })}>
            <option value="">Todos os eventos</option>
            {eventosUnicos.map((evento) => (
              <option key={evento} value={evento}>{evento.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Buscar por nome"
            value={filtros.usuario}
            onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Data Início</label>
          <input type="date" value={filtros.dataInicio} onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })} />
        </div>

        <div className="filter-group">
          <label>Data Fim</label>
          <input type="date" value={filtros.dataFim} onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })} />
        </div>

        <button onClick={() => setFiltros({ role: "", evento: "", dataInicio: "", dataFim: "", usuario: "" })}>
          Limpar Filtros
        </button>
      </section>

      <section className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Role</th>
              <th>Evento</th>
              <th>Detalhes</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.map((log) => (
              <tr key={log.id} onClick={() => setLogSelecionado(log)} className="clickable">
                <td>{log.data}</td>
                <td>{log.usuario}</td>
                <td><span className="role-badge">{log.role}</span></td>
                <td>
                  <span className={`action-badge ${log.evento.toLowerCase()}`}>
                    {log.evento.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="details-preview">{log.detalhes}</td>
                <td>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {logsFiltrados.length === 0 && (
          <div className="empty-state">
            Nenhum log encontrado com os filtros aplicados.
          </div>
        )}
      </section>

      {/* Modal de detalhes expandido */}
      {logSelecionado && (
        <div className="modal-overlay" onClick={() => setLogSelecionado(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Log</h2>
            <p><strong>Data/Hora:</strong> {logSelecionado.data}</p>
            <p><strong>Usuário:</strong> {logSelecionado.usuario} ({logSelecionado.role})</p>
            <p><strong>Evento:</strong> {logSelecionado.evento.replace(/_/g, " ")}</p>
            <p><strong>IP de Origem:</strong> {logSelecionado.ip}</p>
            <div className="modal-details">
              <strong>Descrição completa:</strong>
              <p>{logSelecionado.detalhes}</p>
            </div>
            <button onClick={() => setLogSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
}