// src/pages/point/PendingApprovals.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/point/pendingApprovals.css";

const mockAprovacoesPendentes = [
  {
    id: 1,
    colaborador: "João Silva",
    data: "2026-01-07",
    tipo: "Justificativa de Atraso",
    justificativa: "Consulta médica com hora marcada às 09:00. Anexado atestado.",
    anexo: true,
    status: "Pendente",
  },
  {
    id: 2,
    colaborador: "Maria Oliveira",
    data: "2026-01-06",
    tipo: "Ajuste de Ponto",
    justificativa: "Erro no registro de saída (saiu às 18:00, registrou 17:00).",
    anexo: false,
    status: "Pendente",
  },
  {
    id: 3,
    colaborador: "Pedro Santos",
    data: "2026-01-05",
    tipo: "Falta Justificada",
    justificativa: "Problema familiar grave. Solicita abono.",
    anexo: true,
    status: "Pendente",
  },
];

export default function PendingApprovals() {
  const { user } = useAuth();
  const [pendentes, setPendentes] = useState(mockAprovacoesPendentes);

  const handleAprovar = (id) => {
    setPendentes(pendentes.map(p => 
      p.id === id ? { ...p, status: "Aprovado" } : p
    ));
    toast.success(`Justificativa de ${pendentes.find(p => p.id === id).colaborador} aprovada. RH notificado.`);
    // Futuro: POST /ponto/aprovar + notificação RH
  };

  const handleRejeitar = (id) => {
    setPendentes(pendentes.map(p => 
      p.id === id ? { ...p, status: "Rejeitado" } : p
    ));
    toast.warning(`Justificativa de ${pendentes.find(p => p.id === id).colaborador} rejeitada.`);
    // Futuro: Envia mensagem ao colaborador
  };

  const pendentesAtuais = pendentes.filter(p => p.status === "Pendente");

  return (
    <main className="pending-approvals-container">
      <h1>Aprovações Pendentes</h1>
      <p>Gestor: {user?.nome} • {pendentesAtuais.length} itens pendentes</p>

      {pendentesAtuais.length === 0 ? (
        <div className="empty-state">
          <p>🎉 Nenhuma aprovação pendente no momento.</p>
        </div>
      ) : (
        <div className="approval-cards">
          {pendentesAtuais.map((item) => (
            <div key={item.id} className="approval-card">
              <div className="card-header">
                <strong>{item.colaborador}</strong>
                <span className="card-date">{item.data}</span>
              </div>
              <div className="card-body">
                <p><strong>Tipo:</strong> {item.tipo}</p>
                <p><strong>Justificativa:</strong> {item.justificativa}</p>
                {item.anexo && <p>📎 Anexo incluído</p>}
              </div>
              <div className="card-actions">
                <button 
                  className="btn-reject" 
                  onClick={() => handleRejeitar(item.id)}
                >
                  Rejeitar
                </button>
                <button 
                  className="btn-approve" 
                  onClick={() => handleAprovar(item.id)}
                >
                  Aprovar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}