// src/pages/training/TrainingCatalog.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/training/trainingCatalog.css";

const mockCursos = [
  {
    id: 1,
    nome: "React Avançado com Hooks e Context",
    descricao: "Aprofunde-se em padrões modernos de React para aplicações escaláveis.",
    duracao: "40 horas",
    obrigatorio: true,
    categoria: "Desenvolvimento Frontend",
    statusColaborador: "Não iniciado",
  },
  {
    id: 2,
    nome: "Liderança e Gestão de Equipes",
    descricao: "Desenvolva habilidades de liderança, feedback e motivação.",
    duracao: "20 horas",
    obrigatorio: false,
    categoria: "Liderança",
    statusColaborador: "Concluído",
  },
  {
    id: 3,
    nome: "LGPD na Prática",
    descricao: "Entenda obrigações legais e como proteger dados na empresa.",
    duracao: "8 horas",
    obrigatorio: true,
    categoria: "Compliance",
    statusColaborador: "Em andamento",
  },
  {
    id: 4,
    nome: "Inglês Técnico para TI",
    descricao: "Vocabulário e comunicação técnica em inglês.",
    duracao: "60 horas",
    obrigatorio: false,
    categoria: "Idiomas",
    statusColaborador: "Não iniciado",
  },
  {
    id: 5,
    nome: "Primeiros Socorros",
    descricao: "Treinamento básico de emergência (obrigatório anual).",
    duracao: "4 horas",
    obrigatorio: true,
    categoria: "Saúde e Segurança",
    statusColaborador: "Concluído",
  },
];

export default function TrainingCatalog() {
  const { user } = useAuth();

  const handleIniciarCurso = (curso) => {
    if (curso.statusColaborador !== "Não iniciado") {
      toast.info(`Você já está ${curso.statusColaborador.toLowerCase()} neste curso.`);
      return;
    }

    console.log("Inscrição no curso:", curso.nome, "por", user?.nome);
    toast.success(`Inscrito no curso "${curso.nome}" com sucesso! Boa aprendizagem!`);

    // Futuro: POST /treinamentos/inscricao
  };

  return (
    <main className="training-catalog-container">
      <h1>Trilhas de Aprendizagem</h1>
      <p>Explore os cursos disponíveis e desenvolva suas competências</p>

      <div className="training-grid">
        {mockCursos.map((curso) => (
          <div key={curso.id} className="course-card">
            <div className="card-header">
              <h3>{curso.nome}</h3>
              {curso.obrigatorio && <span className="badge-obrigatory">Obrigatório</span>}
            </div>
            <div className="card-body">
              <p>{curso.descricao}</p>
              <p><strong>Duração:</strong> {curso.duracao}</p>
              <p><strong>Categoria:</strong> {curso.categoria}</p>
              <p>
                <strong>Status:</strong>
                <span className={`status-badge ${curso.statusColaborador.toLowerCase().replace(" ", "-")}`}>
                  {curso.statusColaborador}
                </span>
              </p>
            </div>
            <div className="card-actions">
              {curso.statusColaborador === "Não iniciado" && (
                <button className="btn-iniciar" onClick={() => handleIniciarCurso(curso)}>
                  Iniciar Curso
                </button>
              )}
              {curso.statusColaborador === "Em andamento" && (
                <button className="btn-continuar" disabled>
                  Continuar →
                </button>
              )}
              {curso.statusColaborador === "Concluído" && (
                <button className="btn-concluido" disabled>
                  ✓ Concluído
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}