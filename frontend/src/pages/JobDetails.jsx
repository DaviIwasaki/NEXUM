// src/pages/JobDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Modal from "react-modal";
import "../styles/pages/jobDetails.css";

Modal.setAppElement("#root");

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false); // mock de candidatura

  // Mock fetch de vaga
  useEffect(() => {
    const mockJob = {
      id,
      title: "Desenvolvedor Frontend",
      status: "Aberta", // Aberta / Fechada
      openDate: "2026-01-01",
      deadline: "2026-02-28",
      numCandidates: 5,
      summary: "Buscamos um Desenvolvedor Frontend apaixonado por React e TypeScript.",
      description: `
- Trabalhe com times ágeis
- Projetos desafiadores
- Possibilidade de crescimento rápido
      `,
      requirements: [
        "Experiência com React",
        "Conhecimento em REST APIs",
        "Boas práticas de código",
        "Inglês intermediário"
      ],
      metrics: {
        stages: {
          "Entrevista Inicial": 2,
          "Teste Técnico": 3,
          "Entrevista Final": 1
        },
        avgTimeDays: 14
      }
    };
    setJob(mockJob);
    setIsLoading(false);
  }, [id]);

  const handleApply = () => {
    if (hasApplied) {
      alert("Você já se inscreveu para essa vaga!");
      return;
    }
    if (!resumeFile) {
      alert("Selecione um arquivo!");
      return;
    }
    setHasApplied(true);
    setApplyModalOpen(false);
    alert(`Candidatura enviada: ${resumeFile.name}`);
    setResumeFile(null);
  };

  if (isLoading) return <div className="loading">Carregando vaga...</div>;
  if (!job) return <div className="loading">Vaga não encontrada.</div>;

  return (
    <div className="job-details-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span> &gt;{" "}
        <span onClick={() => navigate("/jobs")}>Lista de Vagas</span> &gt;{" "}
        <span>{job.title}</span>
      </nav>

      {/* Header da vaga */}
      <div className="job-header">
        <h1 className="job-title">{job.title}</h1>
        <div className="job-meta">
          <span className={`job-status ${job.status.toLowerCase()}`}>{job.status}</span>
          <span>Abertura: {job.openDate}</span>
          <span>Prazo: {job.deadline}</span>
          <span>Candidatos: {job.numCandidates}</span>
        </div>

        {/* Botões por papel */}
        <div className="job-actions">
          {user.role === "RH" && (
            <>
              <button
                onClick={() => alert("Editar vaga")}
                className="btn btn-secondary"
              >
                Editar Vaga
              </button>
              <button
                onClick={() => navigate(`/jobs/${id}/candidates`)}
                className="btn btn-primary"
              >
                Ver Candidatos
              </button>
            </>
          )}
          {user.role === "Candidato" && job.status === "Aberta" && (
            <button
              onClick={() => setApplyModalOpen(true)}
              className="btn btn-primary"
            >
              Aplicar
            </button>
          )}
        </div>
      </div>

      {/* Seções da vaga */}
      <div className="job-sections">
        {/* Sobre a vaga */}
        <div className="job-section job-description-section">

          {/* Resumo curto */}
          {job.summary && (
            <p style={{ marginBottom: "12px", fontWeight: 500 }}>{job.summary}</p>
          )}

          {/* Descrição detalhada */}
          {job.description && (
            <div className="job-description-scroll">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Requisitos */}
        <div className="job-section">
          <h2>Requisitos</h2>
          <ul className="job-requirements">
            {job.requirements.map((req, idx) => (
              <li key={idx}>✓ {req}</li>
            ))}
          </ul>
        </div>

        {/* Métricas — apenas RH */}
        {user.role === "RH" && (
          <div className="job-section job-metrics">
            <h2>Métricas da Vaga</h2>
            <p>Tempo médio no processo: {job.metrics.avgTimeDays} dias</p>
            <ul>
              {Object.entries(job.metrics.stages).map(([stage, count]) => (
                <li key={stage}>
                  {stage}: {count} candidato{count > 1 ? "s" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal de candidatura */}
      {applyModalOpen && (
        <Modal
          isOpen={applyModalOpen}
          onRequestClose={() => setApplyModalOpen(false)}
          overlayClassName="modal-overlay"
          className="modal-box"
        >
          <h2>Enviar Currículo</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
          {resumeFile && <p>Arquivo selecionado: {resumeFile.name}</p>}
          <div className="modal-buttons">
            <button className="btn btn-primary" onClick={handleApply}>
              Enviar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setApplyModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobDetails;
