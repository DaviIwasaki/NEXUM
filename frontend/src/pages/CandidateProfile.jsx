// src/pages/CandidateProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/candidateProfile.css";
import pdfParse from "pdf-parse";

// Mock dados do candidato (depois virá da API)
const mockCandidateData = {
  name: "Mariana Oliveira",
  email: "mariana@email.com",
  phone: "(11) 99999-9999",
  cpf: "123.456.789-00",
  linkedin: "linkedin.com/in/mariana",
  area: "Desenvolvimento Frontend",
  level: "Pleno",
  pretensaoSalarial: "R$ 8.000,00",
  resumeText:
    "Desenvolvedora Frontend com 3+ anos em React, TypeScript e UI/UX. Projetos ágeis...",
};

const mockApplications = [
  {
    id: 1,
    job: "Desenvolvedor Frontend",
    status: "Teste Técnico",
    appliedAt: "07/01/2026",
  },
  { id: 2, job: "UX Engineer", status: "Triagem", appliedAt: "03/01/2026" },
];

export default function CandidateProfile() {
  const { user, updateUser } = useAuth();
  const [candidate, setCandidate] = useState(mockCandidateData);
  const [editing, setEditing] = useState(false);
  const [applications] = useState(mockApplications);
  const [expandedId, setExpandedId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(candidate.resumeText);

  const canEdit = user?.role === "Candidato";

  useEffect(() => {
    // Se for o próprio candidato logado, carrega seus dados
    if (user?.role === "Candidato") {
      setCandidate({ ...mockCandidateData, ...user }); // mescla com dados do user
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleSave = () => {
    // Simula PATCH /pessoas
    if (user?.role === "Candidato") {
      updateUser(candidate); // atualiza no auth context também
    }
    alert("Perfil atualizado com sucesso!");
    setEditing(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = await pdfParse(arrayBuffer);
      setResumeText(pdfData.text.substring(0, 1000)); // preview limitado
    }
  };

  return (
    <div className="candidate-profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1>{candidate.name}</h1>
        <span className={`status-badge ${user?.role?.toLowerCase()}`}>
          {user?.role || "Visitante"}
        </span>
        {canEdit && (
          <button className="btn-edit" onClick={() => setEditing(!editing)}>
            {editing ? "Cancelar" : "Editar Perfil"}
          </button>
        )}
      </div>

      {/* Dados pessoais */}
      <section className="profile-section">
        <h2>Dados Pessoais</h2>
        <div className="profile-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              name="name"
              value={candidate.name}
              onChange={handleChange}
              disabled={!editing || !canEdit}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={candidate.email}
              onChange={handleChange}
              disabled={!editing || !canEdit}
            />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input
              name="phone"
              value={candidate.phone}
              onChange={handleChange}
              disabled={!editing || !canEdit}
            />
          </div>
          <div className="form-group">
            <label>Área de Atuação</label>
            <input
              name="area"
              value={candidate.area}
              onChange={handleChange}
              disabled={!editing || !canEdit}
            />
          </div>
          <div className="form-group">
            <label>Senioridade</label>
            <input
              name="level"
              value={candidate.level}
              onChange={handleChange}
              disabled={!editing || !canEdit}
            />
          </div>
          <div className="form-group">
            <label>Pretensão Salarial</label>
            <input
              name="pretensaoSalarial"
              value={candidate.pretensaoSalarial}
              onChange={handleChange}
              disabled={!editing || !canEdit}
            />
          </div>
        </div>
        {editing && canEdit && (
          <button className="btn-save" onClick={handleSave}>
            Salvar Alterações
          </button>
        )}
      </section>

      {/* Currículo */}
      <section className="profile-section">
        <h2>Currículo</h2>
        {canEdit && (
          <input
            type="file"
            accept=".pdf"
            className="resume-upload"
            onChange={handleFileChange}
          />
        )}
        {resumeFile && <p>📄 Novo currículo selecionado: {resumeFile.name}</p>}
        <div className="resume-preview">
          <strong>Preview atual:</strong>
          <pre>{candidate.resumeText}</pre>
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
                <span className={`badge ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>
              {expandedId === app.id && (
                <div className="accordion-body">
                  <p>Data: {app.appliedAt}</p>
                  <p>Status: {app.status}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
