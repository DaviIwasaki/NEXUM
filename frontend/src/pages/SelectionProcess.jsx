// src/pages/SelectionProcess.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/pages/selectionProcess.css";

const mockProcess = {
  id: 1,
  title: "Processo Seletivo - Desenvolvedor Frontend",
  etapas: [
    { id: 1, name: "Triagem" },
    { id: 2, name: "Entrevista RH" },
    { id: 3, name: "Teste Técnico" },
    { id: 4, name: "Entrevista Gestor" },
    { id: 5, name: "Oferta" },
  ],
  candidates: [
    { id: 101, name: "Alice Silva", currentEtapa: "Triagem", score: 85 },
    { id: 102, name: "Bruno Costa", currentEtapa: "Entrevista RH", score: 78 },
    { id: 103, name: "Carla Souza", currentEtapa: "Triagem", score: 92 },
    { id: 104, name: "Diego Lima", currentEtapa: "Teste Técnico", score: 80 },
    { id: 105, name: "Eduardo Rocha", currentEtapa: "Triagem", score: 70 },
  ],
};

export default function SelectionProcess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [process, setProcess] = useState(null);

  const canMove = ["RH", "Gestor"].includes(user?.role);

  useEffect(() => {
    const etapasComCandidatos = mockProcess.etapas.map((etapa) => ({
      ...etapa,
      candidates: mockProcess.candidates.filter(c => c.currentEtapa === etapa.name),
    }));
    setProcess({ ...mockProcess, etapas: etapasComCandidatos });
  }, [id]);

  const onDragEnd = (result) => {
    if (!canMove || !result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    setProcess((prev) => {
      const newEtapas = prev.etapas.map(etapa => ({
        ...etapa,
        candidates: [...etapa.candidates],
      }));

      const sourceEtapa = newEtapas.find(e => e.id === parseInt(source.droppableId));
      const destEtapa = newEtapas.find(e => e.id === parseInt(destination.droppableId));

      const [movedCandidate] = sourceEtapa.candidates.splice(source.index, 1);
      movedCandidate.currentEtapa = destEtapa.name;
      destEtapa.candidates.splice(destination.index, 0, movedCandidate);

      // Aqui poderia chamar API real: PATCH /candidaturas/move
      console.log(`Movido ${movedCandidate.name} de ${sourceEtapa.name} para ${destEtapa.name}`);

      return { ...prev, etapas: newEtapas };
    });
  };

  const openCandidateDetails = (candidateId) => {
    navigate(`/candidato/${candidateId}`);
  };

  if (!process) return <div className="loading">Carregando processo...</div>;

  return (
    <div className="selection-process-container">
      <nav className="breadcrumb">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span> &gt;
        <span onClick={() => navigate("/vagas")}>Vagas</span> &gt;
        <span>{process.title}</span>
      </nav>

      <h1 className="process-title">{process.title}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {process.etapas.map((etapa) => (
            <Droppable droppableId={etapa.id.toString()} key={etapa.id}>
              {(provided, snapshot) => (
                <div
                  className={`kanban-column ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="kanban-header">
                    {etapa.name} ({etapa.candidates.length})
                  </div>
                  <div className="kanban-cards">
                    {etapa.candidates.map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id.toString()}
                        index={index}
                        isDragDisabled={!canMove}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                            onClick={() => openCandidateDetails(candidate.id)}
                          >
                            <div className="card-name">{candidate.name}</div>
                            <div className="card-score">Nota: {candidate.score}/100</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {etapa.candidates.length === 0 && <div className="empty-column">Sem candidatos</div>}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}