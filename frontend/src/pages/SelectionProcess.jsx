// src/pages/SelectionProcess.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import "../styles/pages/selectionProcess.css";

const mockProcess = {
  id: 1,
  title: "Processo Seletivo - Desenvolvedor Frontend",
  etapas: [
    { id: 1, name: "Triagem", candidates: [] },
    { id: 2, name: "Entrevista RH", candidates: [] },
    { id: 3, name: "Entrevista Técnica", candidates: [] },
    { id: 4, name: "Entrevista Gestor", candidates: [] },
    { id: 5, name: "Oferta", candidates: [] },
  ],
  candidates: [
    { id: 101, name: "Alice Silva", status: "Triagem", score: 85 },
    { id: 102, name: "Bruno Costa", status: "Entrevista RH", score: 78 },
    { id: 103, name: "Carla Souza", status: "Triagem", score: 92 },
    { id: 104, name: "Diego Lima", status: "Entrevista Técnica", score: 80 },
    { id: 105, name: "Eduardo Rocha", status: "Triagem", score: 70 },
  ],
};

export default function SelectionProcess({ userRole }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [process, setProcess] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Mock GET /processos/{id}
    const loadProcess = () => {
      // Distribui candidatos nas etapas
      const etapas = mockProcess.etapas.map((etapa) => ({
        ...etapa,
        candidates: mockProcess.candidates.filter(
          (c) => c.status === etapa.name
        ),
      }));
      setProcess({ ...mockProcess, etapas });
    };
    loadProcess();
  }, [id]);

  if (!process) return <div className="loading">Carregando processo...</div>;

  const handleMoveCandidate = (candidateId, direction) => {
    // Só RH ou Gestor podem mover
    if (!["RH", "Gestor"].includes(userRole)) {
      alert("Sem permissão para mover candidato.");
      return;
    }

    setProcess((prev) => {
      const etapasCopy = prev.etapas.map((etapa) => ({
        ...etapa,
        candidates: [...etapa.candidates],
      }));

      let currentIndex = -1;
      let candidate = null;

      // Encontra candidato
      for (let i = 0; i < etapasCopy.length; i++) {
        const idx = etapasCopy[i].candidates.findIndex(
          (c) => c.id === candidateId
        );
        if (idx !== -1) {
          candidate = etapasCopy[i].candidates[idx];
          currentIndex = i;
          etapasCopy[i].candidates.splice(idx, 1);
          break;
        }
      }

      if (!candidate) return prev; // não encontrou

      const targetIndex =
        direction === "next" ? currentIndex + 1 : currentIndex - 1;

      if (targetIndex < 0 || targetIndex >= etapasCopy.length) {
        alert("Não é possível mover mais nessa direção.");
        return prev;
      }

      candidate.status = etapasCopy[targetIndex].name;
      etapasCopy[targetIndex].candidates.push(candidate);

      return { ...prev, etapas: etapasCopy };
    });
  };

  const openCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  return (
    <div className="selection-process-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span> &gt;{" "}
        <span onClick={() => navigate("/jobs")}>Lista de Vagas</span> &gt;{" "}
        <span>{process.title}</span>
      </nav>

      <h1 className="process-title">{process.title}</h1>

      {/* Kanban mock */}
      <div className="kanban-board">
        {process.etapas.map((etapa) => (
          <div key={etapa.id} className="kanban-column">
            <div className="kanban-header">{etapa.name}</div>
            <div className="kanban-cards">
              {etapa.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="kanban-card"
                  onClick={() => openCandidateModal(candidate)}
                >
                  <div className="card-name">{candidate.name}</div>
                  <div className="card-score">Nota: {candidate.score}</div>
                  {["RH", "Gestor"].includes(userRole) && (
                    <div className="card-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCandidate(candidate.id, "prev");
                        }}
                      >
                        ◀
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCandidate(candidate.id, "next");
                        }}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {etapa.candidates.length === 0 && (
                <div className="empty-column">Sem candidatos</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal detalhado candidato */}
      {modalOpen && selectedCandidate && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2>{selectedCandidate.name}</h2>
          <p>Status atual: {selectedCandidate.status}</p>
          <p>Nota fictícia: {selectedCandidate.score}</p>
          <p>
            Histórico de etapas:{" "}
            {process.etapas
              .map(
                (etapa) =>
                  `${etapa.name}: ${
                    etapa.candidates.some((c) => c.id === selectedCandidate.id)
                      ? "Presente"
                      : "Ausente"
                  }`
              )
              .join(", ")}
          </p>
          <Button onClick={() => setModalOpen(false)} variant="secondary">
            Fechar
          </Button>
        </Modal>
      )}
    </div>
  );
}
