// src/pages/CreateJob.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { toast } from "react-toastify";
import "../styles/pages/createJob.css";

export default function CreateJob() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [openSection, setOpenSection] = useState(1);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    requisitos: "",
    salarioMin: "",
    salarioMax: "",
    diversidade: {
      pcd: false,
      genero: false,
      raca: false,
    },
    etapas: [
      {
        nome: "",
        ordem: 1,
        responsavel: "RH",
        descricao: "",
      },
    ],
  });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDiversidade = (key) => {
    setForm({
      ...form,
      diversidade: {
        ...form.diversidade,
        [key]: !form.diversidade[key],
      },
    });
  };

  const handleEtapaChange = (index, field, value) => {
    const updated = [...form.etapas];
    updated[index][field] = value;
    setForm({ ...form, etapas: updated });
  };

  const addEtapa = () => {
    if (form.etapas.length >= 10) {
      toast.warn("Máximo de 10 etapas permitido.");
      return;
    }

    setForm({
      ...form,
      etapas: [
        ...form.etapas,
        {
          nome: "",
          ordem: form.etapas.length + 1,
          responsavel: "RH",
          descricao: "",
        },
      ],
    });
  };

  const removeEtapa = (index) => {
    if (form.etapas.length <= 1) {
      toast.warn("É necessário ter pelo menos uma etapa.");
      return;
    }
    const updated = form.etapas.filter((_, i) => i !== index);
    // Reordena automaticamente
    updated.forEach((etapa, i) => (etapa.ordem = i + 1));
    setForm({ ...form, etapas: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (!form.titulo.trim()) {
      toast.error("O título da vaga é obrigatório.");
      return;
    }
    if (form.etapas.some((etapa) => !etapa.nome.trim())) {
      toast.error("Todas as etapas devem ter um nome.");
      return;
    }

    // Mock de criação (depois será POST real)
    console.log("Vaga criada por:", user?.nome);
    console.log("Payload:", form);

    toast.success("Vaga criada com sucesso!");
    
    // Redireciona para lista de vagas
    setTimeout(() => {
      navigate("/vagas");
    }, 1500);
  };

  return (
    <main className="create-job-container">
      <div className="create-job-header">
        <h1>Criar Nova Vaga</h1>
        <p>Preencha os detalhes para abrir uma nova oportunidade</p>
      </div>

      <form onSubmit={handleSubmit} className="create-job-form">
        {/* Seção 1: Dados da Vaga */}
        <div className="accordion">
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection(1)}
          >
            <span>📌 Dados da Vaga</span>
            <span>{openSection === 1 ? "−" : "+"}</span>
          </button>

          {openSection === 1 && (
            <div className="accordion-content">
              <label>
                Título da vaga *
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Desenvolvedor Frontend Pleno"
                />
              </label>

              <label>
                Descrição (Markdown suportado)
                <textarea
                  name="descricao"
                  rows="6"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="- Cultura de inovação&#10;- Home office híbrido&#10;- Benefícios completos"
                />
              </label>

              <label>
                Requisitos
                <textarea
                  name="requisitos"
                  rows="5"
                  value={form.requisitos}
                  onChange={handleChange}
                  placeholder="• Experiência com React&#10;• Conhecimento em TypeScript&#10;• Inglês intermediário"
                />
              </label>

              <div className="salary-group">
                <label>
                  Salário mínimo (R$)
                  <input
                    type="number"
                    name="salarioMin"
                    value={form.salarioMin}
                    onChange={handleChange}
                    min="0"
                  />
                </label>

                <label>
                  Salário máximo (R$)
                  <input
                    type="number"
                    name="salarioMax"
                    value={form.salarioMax}
                    onChange={handleChange}
                    min="0"
                  />
                </label>
              </div>

              <div className="checkbox-group">
                <span>Cotas de diversidade</span>
                <label>
                  <input
                    type="checkbox"
                    checked={form.diversidade.pcd}
                    onChange={() => handleDiversidade("pcd")}
                  />
                  PCD
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.diversidade.genero}
                    onChange={() => handleDiversidade("genero")}
                  />
                  Gênero
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.diversidade.raca}
                    onChange={() => handleDiversidade("raca")}
                  />
                  Raça
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Seção 2: Etapas do Processo */}
        <div className="accordion">
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection(2)}
          >
            <span>🧩 Etapas do Processo Seletivo</span>
            <span>{openSection === 2 ? "−" : "+"}</span>
          </button>

          {openSection === 2 && (
            <div className="accordion-content">
              {form.etapas.map((etapa, index) => (
                <div key={index} className="etapa-card">
                  <div className="etapa-header">
                    <span>Etapa {index + 1}</span>
                    {form.etapas.length > 1 && (
                      <button
                        type="button"
                        className="remove-etapa"
                        onClick={() => removeEtapa(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <label>
                    Nome da etapa *
                    <input
                      value={etapa.nome}
                      onChange={(e) =>
                        handleEtapaChange(index, "nome", e.target.value)
                      }
                      required
                      placeholder="Ex: Triagem de Currículos"
                    />
                  </label>

                  <label>
                    Ordem
                    <input
                      type="number"
                      value={etapa.ordem}
                      readOnly
                    />
                  </label>

                  <label>
                    Responsável principal
                    <select
                      value={etapa.responsavel}
                      onChange={(e) =>
                        handleEtapaChange(index, "responsavel", e.target.value)
                      }
                    >
                      <option value="RH">RH</option>
                      <option value="Gestor">Gestor</option>
                    </select>
                  </label>

                  <label>
                    Descrição da etapa
                    <textarea
                      value={etapa.descricao}
                      onChange={(e) =>
                        handleEtapaChange(index, "descricao", e.target.value)
                      }
                      placeholder="Ex: Análise inicial de currículos e fit cultural"
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="add-step-btn"
                onClick={addEtapa}
              >
                + Adicionar nova etapa
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/vagas")}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Criar Vaga
          </button>
        </div>
      </form>
    </main>
  );
}