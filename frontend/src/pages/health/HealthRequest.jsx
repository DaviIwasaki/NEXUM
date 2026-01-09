// src/pages/health/HealthRequest.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/health/healthRequest.css";

const mockSolicitacoes = [
  {
    id: 1,
    data: "2026-01-05",
    motivo: "Consulta médica especializada",
    status: "Aprovado",
    anexo: true,
    aprovador: "Carlos Lima (Gestor)",
  },
  {
    id: 2,
    data: "2026-01-08",
    motivo: "Atestado por doença",
    status: "Pendente",
    anexo: true,
    aprovador: null,
  },
];

export default function HealthRequest() {
  const { user } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);
  const [data, setData] = useState("");
  const [motivo, setMotivo] = useState("");
  const [anexo, setAnexo] = useState(null);

  const canApprove = user?.role === "Gestor" || user?.role === "RH";

  const handleEnviar = () => {
    if (!data || !motivo || !anexo) {
      toast.error("Preencha todos os campos e anexe o documento.");
      return;
    }

    console.log("Solicitação saúde enviada por:", user?.nome);
    console.log("Data:", data, "Motivo:", motivo);

    toast.success("Solicitação enviada com sucesso! Aguarde aprovação do gestor.");

    setModalAberto(false);
    setData("");
    setMotivo("");
    setAnexo(null);
  };

  const handleAprovar = (id) => {
    toast.success("Solicitação aprovada. Colaborador notificado.");
  };

  const handleRejeitar = (id) => {
    toast.warning("Solicitação rejeitada. Colaborador notificado.");
  };

  return (
    <main className="health-request-container">
      <div className="header">
        <h1>Solicitações de Saúde</h1>
        <p>{user?.nome}</p>
        {user?.role === "Colaborador" && (
          <button className="btn-new" onClick={() => setModalAberto(true)}>
            + Nova Solicitação
          </button>
        )}
      </div>

      <table className="health-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Motivo</th>
            <th>Anexo</th>
            <th>Status</th>
            {canApprove && <th>Aprovador</th>}
            {canApprove && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {mockSolicitacoes.map((sol) => (
            <tr key={sol.id}>
              <td>{sol.data}</td>
              <td>{sol.motivo}</td>
              <td>{sol.anexo ? "📎 Sim" : "Não"}</td>
              <td>
                <span className={`status-badge ${sol.status.toLowerCase()}`}>
                  {sol.status}
                </span>
              </td>
              {canApprove && <td>{sol.aprovador || "Pendente"}</td>}
              {canApprove && sol.status === "Pendente" && (
                <td>
                  <button className="btn-approve" onClick={() => handleAprovar(sol.id)}>
                    Aprovar
                  </button>
                  <button className="btn-reject" onClick={() => handleRejeitar(sol.id)}>
                    Rejeitar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Nova Solicitação */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Solicitação de Saúde</h2>
            <div className="form-group">
              <label>Data do Atestado *</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Motivo *</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows="4"
                placeholder="Descreva o motivo do afastamento ou consulta..."
              />
            </div>
            <div className="form-group">
              <label>Anexar Atestado/Médico (PDF) *</label>
              <input type="file" accept=".pdf" onChange={(e) => setAnexo(e.target.files[0])} />
              {anexo && <p>Arquivo: {anexo.name}</p>}
            </div>
            <div className="modal-actions">
              <button onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleEnviar}>
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}