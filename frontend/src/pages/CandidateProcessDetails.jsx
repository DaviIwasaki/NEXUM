/* eslint-disable jsx-a11y/anchor-is-valid */
// src/pages/CandidateProcessDetails.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/candidateProcessDetails.css";
import { toast } from "react-hot-toast";

export default function CandidateProcessDetails() {
  const { candidaturaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [candidate, setCandidate] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    // Mock dados do candidato (depois GET /candidaturas/{id})
    setCandidate({
      id: parseInt(candidaturaId),
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 98765-4321",
      cpf: "987.654.321-00",
      address: "Rua das Flores, 123 - Centro, São Paulo/SP",
      currentStage: "Teste Técnico",
      resumeText: `...`,
    });
  }, [candidaturaId]);

  const handleDecision = (decision) => {
    if (!score || score < 0 || score > 10) {
      alert("Nota deve ser entre 0 e 10.");
      return;
    }
    if (!feedback.trim()) {
      alert("Preencha o feedback.");
      return;
    }

    // Simula PATCH /candidaturas/{id}/avaliar
    console.log({
      candidaturaId,
      decision, // "approved" | "rejected"
      score: parseFloat(score),
      feedback,
      evaluatedBy: user?.nome,
      role: user?.role,
    });

    const message =
      decision === "approved"
        ? "✅ Candidato aprovado e avançado na etapa!"
        : "❌ Candidato reprovado.";
    alert(message);
    navigate(-1); // volta pro Kanban

    const handleDecision = (decision) => {
      if (!score || score < 0 || score > 10) {
        toast.error("Nota deve ser entre 0 e 10.");
        return;
      }
      if (!feedback.trim()) {
        toast.error("Preencha o feedback.");
        return;
      }

      // Dados da avaliação
      const evaluationData = {
        candidaturaId,
        decision, // "approved" | "rejected"
        score: parseFloat(score),
        feedback,
        evaluatedBy: user?.nome,
        role: user?.role,
        date: new Date().toLocaleString("pt-BR"),
      };

      console.log("Avaliação registrada:", evaluationData);

      // Simula salvar no contexto do candidato (mock persistente)
      // Supondo que o candidate tem um array de avaliações
      const updatedCandidate = {
        ...candidate,
        evaluations: candidate.evaluations
          ? [...candidate.evaluations, evaluationData]
          : [evaluationData],
        currentStage: decision === "approved" ? "Próxima Etapa" : "Reprovado",
      };

      setCandidate(updatedCandidate);

      // Aqui você poderia salvar no localStorage ou contexto global se quiser persistir entre páginas
      localStorage.setItem(
        `evaluation_${candidaturaId}`,
        JSON.stringify(evaluationData)
      );

      toast.success(
        decision === "approved"
          ? "✅ Candidato aprovado e avançado na etapa!"
          : "❌ Candidato reprovado."
      );

      navigate(-1); // volta pro Kanban
    };
  };

  if (!candidate) return <div className="loading">Carregando detalhes...</div>;

  return (
    <main className="candidate-details-page">
      <header className="candidate-header">
        <div className="candidate-title">
          <h1>{candidate.name}</h1>
          <span className="stage-badge">{candidate.currentStage}</span>
        </div>
      </header>

      <div className="candidate-grid">
        {/* Dados pessoais (read-only para RH/Gestor) */}
        <section className="card">
          <h2>👤 Dados Pessoais</h2>
          <div className="info-row">
            <span>Nome</span>
            <p>{candidate.name}</p>
          </div>
          <div className="info-row">
            <span>Email</span>
            <p>{candidate.email}</p>
          </div>
          <div className="info-row">
            <span>Telefone</span>
            <p>{candidate.phone}</p>
          </div>
          <div className="info-row">
            <span>CPF</span>
            <p>{candidate.cpf}</p>
          </div>
          <div className="info-row">
            <span>Endereço</span>
            <p>{candidate.address}</p>
          </div>
        </section>

        {/* Currículo parsed */}
        <section className="card resume-card">
          <div className="resume-header">
            <h2>📄 Currículo</h2>
            <a
              href="#"
              className="download-link"
              onClick={(e) => {
                e.preventDefault();
                alert("Download PDF simulado");
              }}
            >
              Download PDF
            </a>
          </div>
          <pre className="resume-text">{candidate.resumeText}</pre>
        </section>

        {/* Avaliação (só RH/Gestor) */}
        {(user?.role === "RH" || user?.role === "Gestor") && (
          <section className="card evaluation-card">
            <h2>📊 Sua Avaliação</h2>
            <label>Nota (0-10)</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="score-input"
            />
            <label>Feedback Técnico/Comportamental</label>
            <textarea
              rows="5"
              placeholder="Ex: 'Excelente em React, precisa melhorar em APIs. Pontual e proativo.'"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="decision-actions">
              <button
                className="btn reject"
                onClick={() => handleDecision("rejected")}
              >
                ❌ Reprovar
              </button>
              <button
                className="btn approve"
                onClick={() => handleDecision("approved")}
              >
                ✅ Aprovar e Avançar
              </button>
              {(user?.role === "RH" || user?.role === "Gestor") && (
                <div className="contract-action">
                  <button
                    className="btn-contract"
                    onClick={() => {
                      // Atualiza role para Colaborador
                      // eslint-disable-next-line no-undef
                      updateUser({
                        role: "Colaborador",
                        cargo: "Desenvolvedor Frontend",
                        departamento: "TI",
                      });
                      toast.success(
                        "Candidato contratado! Agora é Colaborador."
                      );
                      // Redireciona para preencher dados contratuais
                      navigate("/colaboradores/novo");
                    }}
                  >
                    🎉 Contratar Candidato
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
