// src/pages/performance/PDI.jsx
import React from "react";
import { useAuth } from "../../store/AuthStore";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/performance/pdi.css";

const mockPDI = [
  {
    objetivo: "Melhorar habilidades de liderança",
    acoes: "Participar do curso de Liderança Avançada e mentoria mensal",
    prazo: "Junho 2026",
    responsavel: "Gestor + RH",
    status: "Em andamento",
  },
  {
    objetivo: "Certificação em React Avançado",
    acoes: "Completar curso online + projeto prático",
    prazo: "Abril 2026",
    responsavel: "Colaborador",
    status: "Planejado",
  },
  {
    objetivo: "Aumentar produtividade em 20%",
    acoes: "Adotar técnica Pomodoro e revisão semanal de tarefas",
    prazo: "Março 2026",
    responsavel: "Colaborador",
    status: "Concluído",
  },
];

export default function PDI() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="pdi-container">
      <button onClick={() => navigate(-1)}>← Voltar</button>

      <h1>Plano de Desenvolvimento Individual (PDI)</h1>
      <p>{user?.nome} • Gerado a partir da Avaliação Semestral 1/2026</p>

      <div className="pdi-summary">
        <p>Baseado nos pontos de melhoria identificados na avaliação 360°, aqui estão suas metas de desenvolvimento para os próximos 12 meses.</p>
      </div>

      <div className="pdi-timeline">
        {mockPDI.map((meta, idx) => (
          <div key={idx} className="pdi-item">
            <div className="pdi-header">
              <h3>{meta.objetivo}</h3>
              <span className={`status-badge ${meta.status.toLowerCase().replace(" ", "-")}`}>
                {meta.status}
              </span>
            </div>
            <div className="pdi-details">
              <p><strong>Ações:</strong> {meta.acoes}</p>
              <p><strong>Prazo:</strong> {meta.prazo}</p>
              <p><strong>Responsável:</strong> {meta.responsavel}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pdi-actions">
        <button>Exportar PDI (PDF)</button>
        <button>Editar Metas</button>
      </div>
    </main>
  );
}