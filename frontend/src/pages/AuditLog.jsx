import { useEffect, useState } from "react";
import "../styles/pages/auditLog.css";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    user: "",
    from: "",
    to: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    // MOCK — futuramente: GET /logs?user=&from=&to=
    setLogs([
      {
        id: 1,
        date: "2026-01-08 14:32",
        user: "Ana Souza (RH)",
        action: "EDIT_JOB",
        details: "Editou a vaga 'Desenvolvedor Frontend'",
      },
      {
        id: 2,
        date: "2026-01-08 13:10",
        user: "Carlos Lima (Admin)",
        action: "LOGIN",
        details: "Login realizado com sucesso",
      },
      {
        id: 3,
        date: "2026-01-07 18:45",
        user: "Mariana Alves (Gestor)",
        action: "MOVE_CANDIDATE",
        details: "Moveu candidato João Silva para etapa Entrevista Técnica",
      },
    ]);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase()))
      return false;
    if (filters.from && log.date < filters.from) return false;
    if (filters.to && log.date > filters.to) return false;
    return true;
  });

  return (
    <main className="audit-log-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        Dashboard &gt; Auditoria
      </nav>

      {/* Header */}
      <header className="audit-log-header">
        <h1>Log de Auditoria</h1>
        <p>Registro de ações realizadas no sistema</p>
      </header>

      {/* Filtros */}
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
      </section>

      {/* Tabela */}
      <section className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} onClick={() => setSelectedLog(log)}>
                <td>{log.date}</td>
                <td>{log.user}</td>
                <td>
                  <span className={`action-badge ${log.action.toLowerCase()}`}>
                    {log.action}
                  </span>
                </td>
                <td className="details-preview">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            Nenhum registro encontrado.
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
            <p><strong>Ação:</strong> {selectedLog.action}</p>
            <p><strong>Descrição:</strong></p>
            <div className="modal-details">{selectedLog.details}</div>

            <button onClick={() => setSelectedLog(null)}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
}
