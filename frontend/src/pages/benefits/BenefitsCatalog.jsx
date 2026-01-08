// src/pages/benefits/BenefitsCatalog.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/benefits/benefitsCatalog.css";

const mockBeneficios = [
  {
    id: 1,
    nome: "Plano de Saúde",
    descricao: "Cobertura nacional, odontológico incluso. Rede credenciada ampla.",
    custoEmpresa: "R$ 600,00",
    custoColaborador: "R$ 200,00",
    tipo: "Saúde",
    permiteDependentes: true,
    statusColaborador: "Não aderido",
  },
  {
    id: 2,
    nome: "Vale Refeição",
    descricao: "Crédito diário de R$ 40,00 em cartão Sodexo. Aceito em milhares de restaurantes.",
    custoEmpresa: "R$ 40,00/dia",
    custoColaborador: "R$ 0,00",
    tipo: "Alimentação",
    permiteDependentes: false,
    statusColaborador: "Aderido",
  },
  {
    id: 3,
    nome: "Vale Transporte",
    descricao: "Cobertura total do transporte público ou combustível (até limite legal).",
    custoEmpresa: "100% custeado",
    custoColaborador: "Até 6% do salário",
    tipo: "Transporte",
    permiteDependentes: false,
    statusColaborador: "Pendente aprovação",
  },
  {
    id: 4,
    nome: "Gympass",
    descricao: "Acesso a mais de 20.000 academias em todo Brasil.",
    custoEmpresa: "R$ 99,00",
    custoColaborador: "R$ 99,00",
    tipo: "Bem-estar",
    permiteDependentes: true,
    statusColaborador: "Não aderido",
  },
];

export default function BenefitsCatalog() {
  const { user } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);
  const [beneficioSelecionado, setBeneficioSelecionado] = useState(null);
  const [dependentes, setDependentes] = useState([{ nome: "", parentesco: "" }]);

  const abrirModalAdesao = (beneficio) => {
    setBeneficioSelecionado(beneficio);
    setModalAberto(true);
  };

  const adicionarDependente = () => {
    setDependentes([...dependentes, { nome: "", parentesco: "" }]);
  };

  const handleAdesao = () => {
    console.log("Adesão solicitada:", beneficioSelecionado.nome, "por", user?.nome);
    console.log("Dependentes:", dependentes);

    toast.success(`Solicitação de adesão ao ${beneficioSelecionado.nome} enviada com sucesso! Aguarde aprovação do RH.`);

    setModalAberto(false);
    setDependentes([{ nome: "", parentesco: "" }]);
  };

  return (
    <main className="benefits-catalog-container">
      <h1>Catálogo de Benefícios</h1>
      <p>Explore os benefícios disponíveis e solicite adesão</p>

      <div className="benefits-grid">
        {mockBeneficios.map((beneficio) => (
          <div key={beneficio.id} className="benefit-card">
            <div className="card-header">
              <h3>{beneficio.nome}</h3>
              <span className={`status-badge ${beneficio.statusColaborador.toLowerCase().replace(" ", "-")}`}>
                {beneficio.statusColaborador}
              </span>
            </div>
            <div className="card-body">
              <p>{beneficio.descricao}</p>
              <p><strong>Custo Empresa:</strong> {beneficio.custoEmpresa}</p>
              <p><strong>Custo Colaborador:</strong> {beneficio.custoColaborador}</p>
              {beneficio.permiteDependentes && <p>✅ Inclui dependentes</p>}
            </div>
            <div className="card-actions">
              {beneficio.statusColaborador === "Não aderido" && (
                <button className="btn-aderir" onClick={() => abrirModalAdesao(beneficio)}>
                  Solicitar Adesão
                </button>
              )}
              {beneficio.statusColaborador === "Aderido" && (
                <button className="btn-ativo" disabled>
                  ✓ Já Aderido
                </button>
              )}
              {beneficio.statusColaborador === "Pendente aprovação" && (
                <button className="btn-pendente" disabled>
                  ⏳ Pendente
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Adesão */}
      {modalAberto && beneficioSelecionado && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Solicitar Adesão: {beneficioSelecionado.nome}</h2>
            <p><strong>Custo mensal para você:</strong> {beneficioSelecionado.custoColaborador}</p>

            {beneficioSelecionado.permiteDependentes && (
              <div className="dependentes-section">
                <h3>Dependentes (opcional)</h3>
                {dependentes.map((dep, index) => (
                  <div key={index} className="dependente-row">
                    <input
                      placeholder="Nome completo"
                      value={dep.nome}
                      onChange={(e) => {
                        const novos = [...dependentes];
                        novos[index].nome = e.target.value;
                        setDependentes(novos);
                      }}
                    />
                    <select
                      value={dep.parentesco}
                      onChange={(e) => {
                        const novos = [...dependentes];
                        novos[index].parentesco = e.target.value;
                        setDependentes(novos);
                      }}
                    >
                      <option value="">Parentesco</option>
                      <option value="Cônjuge">Cônjuge</option>
                      <option value="Filho(a)">Filho(a)</option>
                      <option value="Pai/Mãe">Pai/Mãe</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                ))}
                <button type="button" className="btn-add-dependente" onClick={adicionarDependente}>
                  + Adicionar Dependente
                </button>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleAdesao}>
                Confirmar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}