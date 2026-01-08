// src/pages/performance/EvaluationCycles.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const mockCiclos = [
  {
    id: 1,
    nome: "Avaliação Anual 2025",
    periodo: "Dezembro 2025",
    status: "Concluído",
    participantes: 42,
    inicio: "2025-12-01",
    fim: "2025-12-31",
  },
  {
    id: 2,
    nome: "Avaliação Semestral 1/2026",
    periodo: "Junho 2026",
    status: "Em andamento",
    participantes: 45,
    inicio: "2026-06-01",
    fim: "2026-06-30",
  },
  {
    id: 3,
    nome: "Avaliação Semestral 2/2026",
    periodo: "Dezembro 2026",
    status: "Planejado",
    participantes: 0,
    inicio: "2026-12-01",
    fim: "2026-12-31",
  },
];

export default function EvaluationCycles() {
  const { user } = useAuth();
  const [ciclos, setCiclos] = useState(mockCiclos);
  const [mostrarFormNovo, setMostrarFormNovo] = useState(false);

  const handleIniciarCiclo = () => {
    const novoCiclo = {
      id: ciclos.length + 1,
      nome: `Avaliação ${new Date().getFullYear() + 1}`,
      periodo: "Novo ciclo",
      status: "Em andamento",
      participantes: 0,
      inicio: new Date().toISOString().split("T")[0],
      fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    setCiclos([novoCiclo, ...ciclos]);
    toast.success("Novo ciclo de avaliação iniciado com sucesso!");

    setMostrarFormNovo(false);
  };

  return (
    <main className="evaluation-cycles-container">
      <div className="cycles-header">
        <h1>Ciclos de Avaliação de Desempenho</h1>
        <p>Gestor: {user?.nome}</p>
        {(user?.role === "Gestor" ||
          user?.role === "RH" ||
          user?.role === "Admin") && (
          <button className="btn-new" onClick={() => setMostrarFormNovo(true)}>
            + Iniciar Novo Ciclo
          </button>
        )}
      </div>

      {mostrarFormNovo && (
        <div className="new-cycle-card">
          <h2>Iniciar Novo Ciclo</h2>
          <p>Um novo ciclo será criado com período padrão de 30 dias.</p>
          <div className="actions">
            <button onClick={() => setMostrarFormNovo(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleIniciarCiclo}>
              Confirmar e Iniciar
            </button>
          </div>
        </div>
      )}

      <table className="cycles-table">
        <thead>
          <tr>
            <th>Ciclo</th>
            <th>Período</th>
            <th>Status</th>
            <th>Participantes</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ciclos.map((ciclo) => (
            <tr key={ciclo.id}>
              <td>
                <strong>{ciclo.nome}</strong>
              </td>
              <td>{ciclo.periodo}</td>
              <td>
                <span
                  className={`status-badge ${ciclo.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {ciclo.status}
                </span>
              </td>
              <td>{ciclo.participantes}</td>
              <td>{ciclo.inicio}</td>
              <td>{ciclo.fim}</td>
              <td>
                <button>Ver Detalhes</button>
                {ciclo.status === "Em andamento" && (
                  <button>Notificar Participantes</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <td>
          <button onClick={() => Navigate(`/avaliacao/formulario/${ciclos.id}`)}>
            Realizar Avaliação
          </button>
        </td>
      </table>
    </main>
  );
}
