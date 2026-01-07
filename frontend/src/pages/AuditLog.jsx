// src/pages/AuditLog.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/auditLog.css";

export default function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    user: "",
    from: "",
    to: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    // Mock de logs reais (depois GET /logs)
    const mockLogs = [
      {
        id: 1,
        date: "2026-01-07 14:32",
        user: "Ana Souza (RH)",
        action: "CREATE_JOB",
        details: "Criou a vaga 'Desenvolvedor Frontend Pleno'",
      },
      {
        id: 2,
        date: "2026-01-07 13:10",
        user: "Carlos Lima (Gestor)",
        action: "MOVE_CANDIDATE",
        details: "Moveu João Silva para 'Teste Técnico'",
      },
      {
        id: 3,
        date: "2026-01-07 10:45",
        user: "Mariana Oliveira (Candidato)",
        action: "APPLY_JOB",
        details: "Candidatou-se à vaga 'Desenvolvedor Frontend'",
      },
      {
        id: 4,
        date: "2026-01-06 18:20",
        user: "Admin Master (Admin)",
        action: "CREATE_COMPANY",
        details: "Cadastrou nova empresa 'Tech Solutions Ltda'",
      },
    ];
    setLogs(mockLogs);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.from && new Date(log.date) < new Date(filters.from)) return false;
    if (filters.to && new Date(log.date) > new Date(filters.to + "T23:59:59")) return false;
    return true;
  });

  return (
    <main className="audit-log-page">
      <header className="audit-log-header">
        <h1>Log de Auditoria</h1>
        <p>Registro completo de ações no sistema • Visível para {user?.role}</p>
      </header>

      <section className="audit-filters">
        <input
          type="text"
          placeholder="Filtrar por usuário"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        />
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
        <button onClick={() => setFilters({ user: "", from: "", to: "" })}>
          Limpar filtros
        </button>
      </section>

      <section className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} onClick={() => setSelectedLog(log)} className="clickable">
                <td>{log.date}</td>
                <td>{log.user}</td>
                <td>
                  <span className={`action-badge ${log.action.toLowerCase()}`}>
                    {log.action.replace('_', ' ')}
                  </span>
                </td>
                <td className="details-preview">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            Nenhum registro encontrado com os filtros aplicados.
          </div>
        )}
      </section>

      {/* Modal de detalhes */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes da Ação</h2>
            <p><strong>Data:</strong> {selectedLog.date}</p>
            <p><strong>Usuário:</strong> {selectedLog.user}</p>
            <p><strong>Ação:</strong> {selectedLog.action.replace('_', ' ')}</p>
            <div className="modal-details">
              <strong>Descrição completa:</strong>
              <p>{selectedLog.details}</p>
            </div>
            <button onClick={() => setSelectedLog(null)}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
}