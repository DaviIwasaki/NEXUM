import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/pages/candidateProcessDetails.css";

export default function CandidateProcessDetails() {
  const { candidaturaId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    // MOCK — futuramente GET /candidaturas/{id}
    setCandidate({
      id: candidaturaId,
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 98765-4321",
      stage: "Entrevista Técnica",
      resumeText: `
## Experiência
- Desenvolvedor Frontend na Empresa X
- React, TypeScript, CSS

## Formação
- Bacharel em Ciência da Computação

## Habilidades
- React
- APIs REST
- Git
      `,
    });
  }, [candidaturaId]);

  const handleDecision = (decision) => {
    if (!feedback || !score) {
      alert("Preencha nota e avaliação antes de decidir.");
      return;
    }

    // MOCK PATCH /candidaturas/avaliar
    console.log({
      candidaturaId,
      decision,
      score,
      feedback,
    });

    alert(`Candidato ${decision === "approved" ? "aprovado" : "reprovado"} com sucesso.`);
    navigate(-1);
  };

  if (!candidate) return <div className="loading">Carregando candidato...</div>;

  return (
    <main className="candidate-details-page">
      {/* Header */}
      <header className="candidate-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <div>
          <h1>{candidate.name}</h1>
          <span className="stage-badge">{candidate.stage}</span>
        </div>
      </header>

      <div className="candidate-grid">
        {/* Dados pessoais */}
        <section className="card">
          <h2>Dados Pessoais</h2>
          <div className="info-row">
            <span>Email</span>
            <p>{candidate.email}</p>
          </div>
          <div className="info-row">
            <span>Telefone</span>
            <p>{candidate.phone}</p>
          </div>
        </section>

        {/* Currículo */}
        <section className="card resume-card">
          <div className="resume-header">
            <h2>Currículo</h2>
            <a href="#" className="download-link">
              Download PDF
            </a>
          </div>
          <pre className="resume-text">{candidate.resumeText}</pre>
        </section>

        {/* Avaliação */}
        <section className="card evaluation-card">
          <h2>Avaliação</h2>

          <label>Nota (0 a 10)</label>
          <input
            type="number"
            min="0"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />

          <label>Feedback</label>
          <textarea
            rows="4"
            placeholder="Escreva sua avaliação técnica/comportamental..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div className="decision-actions">
            <button
              className="btn reject"
              onClick={() => handleDecision("rejected")}
            >
              Reprovar
            </button>
            <button
              className="btn approve"
              onClick={() => handleDecision("approved")}
            >
              Aprovar
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
