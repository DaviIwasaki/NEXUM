// src/pages/performance/EvaluationForm.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";

const competencias = [
  { id: 1, nome: "Comunicação", peso: 20 },
  { id: 2, nome: "Trabalho em Equipe", peso: 15 },
  { id: 3, nome: "Produtividade", peso: 25 },
  { id: 4, nome: "Inovação", peso: 15 },
  { id: 5, nome: "Liderança", peso: 10 },
  { id: 6, nome: "Responsabilidade", peso: 15 },
];

const metasExemplo = [
  { id: 1, descricao: "Entregar projeto X até Q2", peso: 40, progresso: 70 },
  { id: 2, descricao: "Reduzir bugs em produção em 30%", peso: 30, progresso: 50 },
  { id: 3, descricao: "Mentorar 2 juniores", peso: 30, progresso: 100 },
];

export default function EvaluationForm() {
  const { cicloId } = useParams(); // futuro: id do ciclo
  const navigate = useNavigate();
  const { user } = useAuth();

  const [avaliacao, setAvaliacao] = useState({
    competencias: competencias.map(c => ({ ...c, nota: 0, comentario: "" })),
    metas: metasExemplo.map(m => ({ ...m, comentario: "" })),
    feedbackGeral: "",
    pontosFortes: "",
    pontosMelhoria: "",
  });

  const [progresso, setProgresso] = useState(0);

  const calcularProgresso = () => {
    let preenchidos = 0;
    let total = competencias.length + metasExemplo.length + 3; // + feedback, fortes, melhoria

    avaliacao.competencias.forEach(c => { if (c.nota > 0) preenchidos++; });
    avaliacao.metas.forEach(m => { if (m.comentario.trim()) preenchidos++; });
    if (avaliacao.feedbackGeral.trim()) preenchidos++;
    if (avaliacao.pontosFortes.trim()) preenchidos++;
    if (avaliacao.pontosMelhoria.trim()) preenchidos++;

    setProgresso(Math.round((preenchidos / total) * 100));
  };

  const handleNotaChange = (id, nota) => {
    setAvaliacao(prev => ({
      ...prev,
      competencias: prev.competencias.map(c => c.id === id ? { ...c, nota } : c)
    }));
    calcularProgresso();
  };

  const handleComentarioChange = (id, comentario, tipo) => {
    if (tipo === "competencia") {
      setAvaliacao(prev => ({
        ...prev,
        competencias: prev.competencias.map(c => c.id === id ? { ...c, comentario } : c)
      }));
    } else {
      setAvaliacao(prev => ({
        ...prev,
        metas: prev.metas.map(m => m.id === id ? { ...m, comentario } : m)
      }));
    }
    calcularProgresso();
  };

  const handleSubmit = () => {
    if (progresso < 80) {
      toast.warning("Preencha pelo menos 80% da avaliação para submeter.");
      return;
    }

    console.log("Avaliação submetida por:", user?.nome);
    console.log("Dados:", avaliacao);

    toast.success("Avaliação submetida com sucesso! PDI gerado automaticamente.");

    // Futuro: POST /avaliacoes + gerar PDI
    navigate("/pdi");
  };

  return (
    <main className="evaluation-form-container">
      <h1>Formulário de Avaliação 360°</h1>
      <p>Ciclo: Avaliação Semestral 1/2026 • Avaliador: {user?.nome}</p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progresso}%` }}>
          {progresso}%
        </div>
      </div>

      <section className="section-competencias">
        <h2>Avaliação por Competências</h2>
        {avaliacao.competencias.map((comp) => (
          <div key={comp.id} className="competencia-item">
            <div className="competencia-header">
              <strong>{comp.nome}</strong> <span>(Peso: {comp.peso}%)</span>
            </div>
            <div className="nota-selector">
              {[1,2,3,4,5].map(nota => (
                <button
                  key={nota}
                  className={comp.nota === nota ? "selected" : ""}
                  onClick={() => handleNotaChange(comp.id, nota)}
                >
                  {nota}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Comentário sobre esta competência..."
              value={comp.comentario}
              onChange={(e) => handleComentarioChange(comp.id, e.target.value, "competencia")}
              rows="3"
            />
          </div>
        ))}
      </section>

      <section className="section-metas">
        <h2>Acompanhamento de Metas</h2>
        {avaliacao.metas.map((meta) => (
          <div key={meta.id} className="meta-item">
            <strong>{meta.descricao}</strong> <span>(Peso: {meta.peso}%)</span>
            <div className="meta-progress">
              Progresso: {meta.progresso}%
            </div>
            <textarea
              placeholder="Comentário sobre o alcance desta meta..."
              value={meta.comentario}
              onChange={(e) => handleComentarioChange(meta.id, e.target.value, "meta")}
              rows="3"
            />
          </div>
        ))}
      </section>

      <section className="section-feedback">
        <h2>Feedback Geral</h2>
        <textarea
          placeholder="Pontos fortes do avaliado..."
          value={avaliacao.pontosFortes}
          onChange={(e) => {
            setAvaliacao(prev => ({ ...prev, pontosFortes: e.target.value }));
            calcularProgresso();
          }}
          rows="4"
        />
        <textarea
          placeholder="Pontos de melhoria e sugestões..."
          value={avaliacao.pontosMelhoria}
          onChange={(e) => {
            setAvaliacao(prev => ({ ...prev, pontosMelhoria: e.target.value }));
            calcularProgresso();
          }}
          rows="4"
        />
        <textarea
          placeholder="Feedback geral (360°: autoavaliação, gestor, pares)..."
          value={avaliacao.feedbackGeral}
          onChange={(e) => {
            setAvaliacao(prev => ({ ...prev, feedbackGeral: e.target.value }));
            calcularProgresso();
          }}
          rows="6"
        />
      </section>

      <div className="form-actions">
        <button onClick={() => navigate(-1)}>Cancelar</button>
        <button className="btn-submit" onClick={handleSubmit}>
          Submeter Avaliação e Gerar PDI
        </button>
      </div>
    </main>
  );
}