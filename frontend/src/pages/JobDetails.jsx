// src/pages/JobDetails.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import ReactMarkdown from "react-markdown";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "../styles/pages/jobDetails.css";

Modal.setAppElement("#root");

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false); // Controla se já se candidatou a ESTA vaga

  // Token e API base
  const token = localStorage.getItem("nexum_token");
  const apiBase = "http://localhost:8000";

  // Função memoizada para fetch autenticado
  const fetchWithToken = useCallback(
    async (endpoint, options = {}) => {
      if (!token) throw new Error("Token não encontrado");

      const response = await fetch(`${apiBase}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ${response.status}`);
      }

      return response.json();
    },
    [token]
  );

  // Carrega vaga + verifica candidaturas do usuário logado
  useEffect(() => {
    const loadJobAndCheckApplication = async () => {
      if (!id || !user) return;

      setIsLoading(true);
      setError(null);
      setHasApplied(false); // Reset inicial

      try {
        // 1. Carrega detalhes da vaga
        const jobData = await fetchWithToken(`/jobs/${id}`);
        setJob(jobData);

        // 2. Se for Candidato, verifica se já se candidatou a ESTA vaga específica
        if (user.role === "Candidato") {
          try {
            const candidaturas = await fetchWithToken(
              `/users/${user.id}/candidatures`
            );
            // Verifica se existe alguma candidatura com o job_id atual
            const alreadyApplied = candidaturas.some(
              (candidatura) => candidatura.job_id === Number(id)
            );
            setHasApplied(alreadyApplied);
          } catch (candidaturaErr) {
            console.warn(
              "[JobDetails] Falha ao verificar candidaturas:",
              candidaturaErr
            );
            // Não quebra a tela se falhar a verificação
            toast.warn("Não foi possível verificar candidaturas anteriores.");
          }
        }
      } catch (err) {
        console.error("[JobDetails] Erro ao carregar vaga:", err);
        toast.error(
          err.message || "Não foi possível carregar os detalhes da vaga"
        );
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobAndCheckApplication();
  }, [id, user, fetchWithToken]);

  // Enviar nova candidatura
  const handleApply = async () => {
    if (hasApplied) {
      toast.warn("Você já se candidatou para esta vaga!");
      return;
    }
    if (!resumeFile) {
      toast.error("Selecione seu currículo em PDF antes de enviar.");
      return;
    }

    setApplying(true);

    try {
      const formData = new FormData();
      formData.append("job_id", id);
      formData.append("curriculo", resumeFile);

      await fetchWithToken("/candidaturas", {
        method: "POST",
        body: formData,
      });

      toast.success("Candidatura enviada com sucesso!");
      setHasApplied(true); // Atualiza imediatamente na tela
      setApplyModalOpen(false);
      setResumeFile(null);
    } catch (err) {
      toast.error(
        err.message || "Falha ao enviar candidatura. Tente novamente."
      );
    } finally {
      setApplying(false);
    }
  };

  const handleViewCandidates = () => {
    navigate(`/processo/${id}`);
  };

  if (isLoading) {
    return <div className="loading">Carregando detalhes da vaga...</div>;
  }

  if (error || !job) {
    return (
      <div className="error">
        {error || "Vaga não encontrada. Tente novamente mais tarde."}
      </div>
    );
  }

  return (
    <div className="job-details-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span> &gt;
        <span onClick={() => navigate("/vagas")}>Lista de Vagas</span> &gt;
        <span>{job.titulo}</span>
      </nav>

      {/* Header */}
      <div className="job-header">
        <h1 className="job-title">{job.titulo}</h1>
        <div className="job-meta">
          <span
            className={`job-status ${job.status?.toLowerCase() || "aberta"}`}
          >
            {job.status || "Aberta"}
          </span>
          <span>
            Abertura:{" "}
            {job.data_abertura
              ? new Date(job.data_abertura).toLocaleDateString("pt-BR")
              : "-"}
          </span>
          {job.prazo && (
            <span>
              Prazo: {new Date(job.prazo).toLocaleDateString("pt-BR")}
            </span>
          )}
          <span>Candidatos: {job.num_candidatos ?? 0}</span>
        </div>

        {/* Ações */}
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
              disabled={hasApplied || applying}
            >
              {hasApplied
                ? "Já se candidatou"
                : applying
                ? "Enviando..."
                : "Aplicar para a vaga"}
            </button>
          )}
        </div>
      </div>

      {/* Seções da vaga */}
      <div className="job-sections">
        {job.resumo && (
          <div className="job-section">
            <h2>Resumo da Vaga</h2>
            <p>{job.resumo}</p>
          </div>
        )}

        {job.descricao && (
          <div className="job-section">
            <h2>Descrição da Vaga</h2>
            <div className="job-description-scroll">
              <ReactMarkdown>{job.descricao}</ReactMarkdown>
            </div>
          </div>
        )}

        {job.requisitos
          ?.toString()
          .split("\n")
          .filter(Boolean)
          .map((req, idx) => (
            <li key={idx}>✓ {req.trim()}</li>
          ))}

        {/* Métricas (RH/Gestor) */}
        {(user?.role === "RH" || user?.role === "Gestor") && job.metrics && (
          <div className="job-section job-metrics">
            <h2>Métricas da Vaga</h2>
            <p>
              Tempo médio no processo: {job.metrics.avg_time_days || "-"} dias
            </p>
            <ul>
              {Object.entries(job.metrics.stages || {}).map(
                ([stage, count]) => (
                  <li key={stage}>
                    {stage}: {count} candidato{count !== 1 ? "s" : ""}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Modal de Candidatura */}
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
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          disabled={applying}
        />
        {resumeFile && <p>Arquivo selecionado: {resumeFile.name}</p>}

        <div className="modal-buttons">
          <button
            className="btn btn-primary"
            onClick={handleApply}
            disabled={applying || !resumeFile}
          >
            {applying ? "Enviando..." : "Enviar Candidatura"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setApplyModalOpen(false)}
            disabled={applying}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetails;
