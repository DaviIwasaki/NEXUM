// src/pages/JobDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import ReactMarkdown from "react-markdown";
import Modal from "react-modal";
import "../styles/pages/jobDetails.css";

Modal.setAppElement("#root");

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false); // mock temporário

  // Mock fetch da vaga (depois será API real)
  useEffect(() => {
    const mockJob = {
      id,
      title: "Desenvolvedor Frontend",
      status: "Aberta",
      openDate: "2026-01-01",
      deadline: "2026-02-28",
      numCandidates: 12,
      summary:
        "Buscamos um Desenvolvedor Frontend apaixonado por React e TypeScript para projetos desafiadores.",
      description: `
- Trabalhe com times ágeis e metodologias modernas
- Projetos de alto impacto
- Cultura de aprendizado contínuo
- Possibilidade de crescimento rápido
      `,
      requirements: [
        "Experiência sólida com React e TypeScript",
        "Conhecimento em REST APIs e consumo de serviços",
        "Boas práticas de código limpo e testes",
        "Inglês intermediário ou superior",
      ],
      metrics: {
        stages: {
          Triagem: 5,
          "Entrevista RH": 4,
          "Teste Técnico": 2,
          "Entrevista Final": 1,
        },
        avgTimeDays: 18,
      },
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
      alert("Por favor, selecione seu currículo em PDF.");
      return;
    }
    setHasApplied(true);
    setApplyModalOpen(false);
    alert(`Candidatura enviada com sucesso!\nArquivo: ${resumeFile.name}`);
    setResumeFile(null);
  };

  const handleViewCandidates = () => {
    // Agora navega para a rota correta do processo seletivo
    navigate(`/processo/${id}`);
  };

  if (isLoading) return <div className="loading">Carregando vaga...</div>;
  if (!job) return <div className="loading">Vaga não encontrada.</div>;

  return (
    <div className="job-details-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span> &gt;
        <span onClick={() => navigate("/vagas")}>Lista de Vagas</span> &gt;
        <span>{job.title}</span>
      </nav>

      {/* Header da vaga */}
      <div className="job-header">
        <h1 className="job-title">{job.title}</h1>
        <div className="job-meta">
          <span className={`job-status ${job.status.toLowerCase()}`}>
            {job.status}
          </span>
          <span>Abertura: {job.openDate}</span>
          <span>Prazo: {job.deadline}</span>
          <span>Candidatos: {job.numCandidates}</span>
        </div>

        {/* Ações por papel */}
        <div className="job-actions">
          {(user?.role === "RH" || user?.role === "Gestor") && (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/vagas/${id}/edit`)}
              >
                Editar Vaga
              </button>
              <button
                className="btn btn-primary"
                onClick={handleViewCandidates}
              >
                Ver Candidatos
              </button>
            </>
          )}

          {user?.role === "Candidato" && job.status === "Aberta" && (
            <button
              className="btn btn-primary"
              onClick={() => setApplyModalOpen(true)}
            >
              Aplicar para a vaga
            </button>
          )}
        </div>
      </div>

      {/* Seções da vaga */}
      <div className="job-sections">
        {job.summary && <p className="job-summary">{job.summary}</p>}

        {job.description && (
          <div className="job-section">
            <h2>Descrição da Vaga</h2>
            <div className="job-description-scroll">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="job-section">
          <h2>Requisitos</h2>
          <ul className="job-requirements">
            {job.requirements.map((req, idx) => (
              <li key={idx}>✓ {req}</li>
            ))}
          </ul>
        </div>

        {/* Métricas só para RH e Gestor */}
        {(user?.role === "RH" || user?.role === "Gestor") && job.metrics && (
          <div className="job-section job-metrics">
            <h2>Métricas da Vaga</h2>
            <p>Tempo médio no processo: {job.metrics.avgTimeDays} dias</p>
            <ul>
              {Object.entries(job.metrics.stages).map(([stage, count]) => (
                <li key={stage}>
                  {stage}: {count} candidato{count !== 1 ? "s" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal de candidatura */}
      <Modal
        isOpen={applyModalOpen}
        onRequestClose={() => setApplyModalOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-box"
      >
        <h2>Enviar Currículo</h2>
        <p>Selecione seu currículo em formato PDF</p>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />
        {resumeFile && <p>Arquivo selecionado: {resumeFile.name}</p>}
        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={handleApply}>
            Enviar Candidatura
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setApplyModalOpen(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetails;
