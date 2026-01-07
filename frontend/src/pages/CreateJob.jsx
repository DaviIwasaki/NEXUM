import { useState } from "react";
import "../styles/pages/createJob.css";

export default function CreateJob() {
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
      raca: false
    },
    etapas: [
      {
        nome: "",
        ordem: 1,
        responsavel: "RH",
        descricao: ""
      }
    ]
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
        [key]: !form.diversidade[key]
      }
    });
  };

  const handleEtapaChange = (index, field, value) => {
    const updated = [...form.etapas];
    updated[index][field] = value;
    setForm({ ...form, etapas: updated });
  };

  const addEtapa = () => {
    if (form.etapas.length >= 10) return;

    setForm({
      ...form,
      etapas: [
        ...form.etapas,
        {
          nome: "",
          ordem: form.etapas.length + 1,
          responsavel: "RH",
          descricao: ""
        }
      ]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Payload final:", form);

    alert("Vaga criada com sucesso (mock)!");
    // depois:
    // POST /vagas
    // POST /processos_seletivos
    // POST /etapas
  };

  return (
    <main className="create-job-container">
      <h1>Criar nova vaga</h1>
      <p className="subtitle">
        Preencha as informações abaixo para abrir uma nova vaga
      </p>

      <form onSubmit={handleSubmit} className="create-job-form">
        {/* Seção 1 */}
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
                Título da vaga
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Descrição
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                />
              </label>

              <label>
                Requisitos
                <textarea
                  name="requisitos"
                  value={form.requisitos}
                  onChange={handleChange}
                />
              </label>

              <div className="salary-group">
                <label>
                  Salário mínimo
                  <input
                    type="number"
                    name="salarioMin"
                    value={form.salarioMin}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Salário máximo
                  <input
                    type="number"
                    name="salarioMax"
                    value={form.salarioMax}
                    onChange={handleChange}
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

        {/* Seção 2 */}
        <div className="accordion">
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection(2)}
          >
            <span>🧩 Etapas do Processo</span>
            <span>{openSection === 2 ? "−" : "+"}</span>
          </button>

          {openSection === 2 && (
            <div className="accordion-content">
              {form.etapas.map((etapa, index) => (
                <div key={index} className="etapa-card">
                  <label>
                    Nome da etapa
                    <input
                      value={etapa.nome}
                      onChange={(e) =>
                        handleEtapaChange(index, "nome", e.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Ordem
                    <input
                      type="number"
                      value={etapa.ordem}
                      onChange={(e) =>
                        handleEtapaChange(index, "ordem", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Responsável
                    <select
                      value={etapa.responsavel}
                      onChange={(e) =>
                        handleEtapaChange(index, "responsavel", e.target.value)
                      }
                    >
                      <option value="RH">RH</option>
                      <option value="GESTOR">Gestor</option>
                    </select>
                  </label>

                  <label>
                    Descrição
                    <textarea
                      value={etapa.descricao}
                      onChange={(e) =>
                        handleEtapaChange(index, "descricao", e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}

              <button
                type="button"
                className="add-step-btn"
                onClick={addEtapa}
              >
                + Adicionar etapa
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Criar Vaga
        </button>
      </form>
    </main>
  );
}
