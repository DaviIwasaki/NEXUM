// src/pages/CandidateProfile.jsx
import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import "../styles/pages/candidateProfile.css";

// Mock user
const mockUser = {
  role: "Candidato", // "Candidato" | "RH" | "Gestor"
};

// Mock candidato
const mockCandidate = {
  name: "Mariana Oliveira",
  email: "mariana@email.com",
  phone: "(11) 99999-9999",
  linkedin: "linkedin.com/in/mariana",
  area: "Desenvolvimento Frontend",
  level: "Pleno",
  status: "Em processo",
  resumeText:
    "Desenvolvedora Frontend com experiência em React, TypeScript e UI Design...",
};

// Mock histórico
const mockApplications = [
  {
    id: 1,
    job: "Desenvolvedor Frontend",
    status: "Entrevista Técnica",
    appliedAt: "12/01/2026",
  },
  {
    id: 2,
    job: "UX Engineer",
    status: "Triagem",
    appliedAt: "03/12/2025",
  },
];

export default function CandidateProfile() {
  const [user] = useState(mockUser);
  const [candidate, setCandidate] = useState(mockCandidate);
  const [editing, setEditing] = useState(false);
  const [applications] = useState(mockApplications);
  const [expandedId, setExpandedId] = useState(null);

  const canEdit = user.role === "Candidato";

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // PATCH /pessoas (futuro)
    setEditing(false);
  };

  return (
    <div className="candidate-profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-title">
          <h1>{candidate.name}</h1>
          <span className={`status-badge ${candidate.status}`}>
            {candidate.status}
          </span>
        </div>

        {canEdit && (
          <Button onClick={() => setEditing(!editing)} variant="primary">
            {editing ? "Cancelar" : "Editar Perfil"}
          </Button>
        )}
      </div>

      {/* Dados pessoais */}
      <section className="profile-section">
        <h2>Dados Pessoais</h2>

        <div className="profile-form">
          {/* Nome (sempre somente leitura) */}
          <div className="form-group">
            <label>Nome</label>
            <p className="readonly-field">{candidate.name}</p>
          </div>

          {/* Campos editáveis */}
          {[
            ["email", "Email"],
            ["phone", "Telefone"],
            ["linkedin", "LinkedIn"],
            ["area", "Área"],
            ["level", "Senioridade"],
          ].map(([field, label]) => (
            <div key={field} className="form-group">
              <label>{label}</label>
              <input
                name={field}
                value={candidate[field]}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          ))}
        </div>

        {editing && (
          <Button onClick={handleSave} variant="primary">
            Salvar Alterações
          </Button>
        )}
      </section>

      {/* Currículo */}
      <section className="profile-section">
        <h2>Currículo</h2>

        {canEdit && (
          <input type="file" accept=".pdf" className="resume-upload" />
        )}

        <div className="resume-preview">
          <strong>Preview do currículo:</strong>
          <p>{candidate.resumeText}</p>
        </div>
      </section>

      {/* Histórico */}
      <section className="profile-section">
        <h2>Histórico de Candidaturas</h2>

        <div className="accordion">
          {applications.map((app) => (
            <div key={app.id} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() =>
                  setExpandedId(expandedId === app.id ? null : app.id)
                }
              >
                <span>{app.job}</span>
                <span className="badge">{app.status}</span>
              </div>

              {expandedId === app.id && (
                <div className="accordion-body">
                  <p>Data de candidatura: {app.appliedAt}</p>
                  <p>Status atual: {app.status}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
