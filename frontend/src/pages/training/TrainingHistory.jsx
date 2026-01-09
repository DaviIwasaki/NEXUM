// src/pages/training/TrainingHistory.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/training/trainingHistory.css";

const mockHistoricoTreinamentos = [
  {
    id: 1,
    curso: "Liderança e Gestão de Equipes",
    dataConclusao: "2025-12-15",
    duracao: "20 horas",
    status: "Concluído",
    certificadoEnviado: true,
    validade: "Ilimitado",
  },
  {
    id: 2,
    curso: "Primeiros Socorros",
    dataConclusao: "2025-11-20",
    duracao: "4 horas",
    status: "Concluído",
    certificadoEnviado: true,
    validade: "2026-11-20",
  },
  {
    id: 3,
    curso: "LGPD na Prática",
    dataConclusao: null,
    duracao: "8 horas",
    status: "Em andamento",
    certificadoEnviado: false,
    validade: null,
  },
  {
    id: 4,
    curso: "React Avançado",
    dataConclusao: null,
    duracao: "40 horas",
    status: "Pendente",
    certificadoEnviado: false,
    validade: null,
  },
];

export default function TrainingHistory() {
  const { user } = useAuth();
  const [filtro, setFiltro] = useState("Todos");
  const [uploadModal, setUploadModal] = useState(false);
  const [cursoParaUpload, setCursoParaUpload] = useState(null);

  const canApprove = user?.role === "RH" || user?.role === "Admin";

  const filtrados = mockHistoricoTreinamentos.filter((t) => {
    if (filtro === "Concluídos") return t.status === "Concluído";
    if (filtro === "Pendentes") return t.status !== "Concluído";
    return true;
  });

  const handleUploadCertificado = (curso) => {
    setCursoParaUpload(curso);
    setUploadModal(true);
  };

  const confirmarUpload = () => {
    toast.success(`Certificado de "${cursoParaUpload.curso}" enviado para aprovação!`);
    setUploadModal(false);
    setCursoParaUpload(null);
    // Futuro: POST /treinamentos/certificado
  };

  const handleAprovar = (id) => {
    toast.success("Certificado aprovado!");
  };

  return (
    <main className="training-history-container">
      <h1>Histórico de Treinamentos</h1>
      <p>{user?.nome}</p>

      <div className="filter">
        <label>Filtrar por:</label>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Concluídos">Concluídos</option>
          <option value="Pendentes">Em andamento / Pendentes</option>
        </select>
      </div>

      <div className="timeline">
        {filtrados.map((treinamento) => (
          <div key={treinamento.id} className="timeline-item">
            <div className="timeline-date">
              {treinamento.dataConclusao || "Em andamento"}
            </div>
            <div className="timeline-content">
              <h3>{treinamento.curso}</h3>
              <p>Duração: {treinamento.duracao}</p>
              <p>
                Status: 
                <span className={`status-badge ${treinamento.status.toLowerCase().replace(" ", "-")}`}>
                  {treinamento.status}
                </span>
              </p>
              {treinamento.validade && <p>Validade até: {treinamento.validade}</p>}
              <p>Certificado: {treinamento.certificadoEnviado ? "Enviado" : "Não enviado"}</p>

              <div className="actions">
                {!treinamento.certificadoEnviado && treinamento.status === "Concluído" && (
                  <button onClick={() => handleUploadCertificado(treinamento)}>
                    Upload Certificado
                  </button>
                )}
                {canApprove && !treinamento.certificadoEnviado && treinamento.status === "Concluído" && (
                  <button className="btn-approve" onClick={() => handleAprovar(treinamento.id)}>
                    Aprovar Certificado
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Upload Certificado */}
      {uploadModal && cursoParaUpload && (
        <div className="modal-overlay" onClick={() => setUploadModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Upload de Certificado</h2>
            <p>Curso: <strong>{cursoParaUpload.curso}</strong></p>
            <input type="file" accept=".pdf,.jpg,.png" />
            <div className="modal-actions">
              <button onClick={() => setUploadModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={confirmarUpload}>
                Enviar Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}