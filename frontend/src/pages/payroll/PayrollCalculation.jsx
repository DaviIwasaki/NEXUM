// src/pages/payroll/PayrollCalculation.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";

const mockFolhaMensal = [
  {
    id: 501,
    nome: "João Silva",
    cargo: "Desenvolvedor Frontend Pleno",
    salarioBase: 10500,
    horasExtras: 8,
    valorExtras: 1050,
    beneficios: 1200,
    descontos: 1850,
    liquido: 10900,
  },
  {
    id: 502,
    nome: "Maria Oliveira",
    cargo: "Analista de RH",
    salarioBase: 7500,
    horasExtras: 0,
    valorExtras: 0,
    beneficios: 900,
    descontos: 1200,
    liquido: 7200,
  },
  {
    id: 503,
    nome: "Pedro Santos",
    cargo: "Product Manager",
    salarioBase: 14000,
    horasExtras: 12,
    valorExtras: 2100,
    beneficios: 1500,
    descontos: 2500,
    liquido: 14100,
  },
];

export default function PayrollCalculation() {
  const { user } = useAuth();
  const [mesReferencia, setMesReferencia] = useState("2026-01");
  const [folhaGerada, setFolhaGerada] = useState(false);

  const totalBruto = mockFolhaMensal.reduce((acc, emp) => acc + emp.salarioBase + emp.valorExtras + emp.beneficios, 0);
  const totalDescontos = mockFolhaMensal.reduce((acc, emp) => acc + emp.descontos, 0);
  const totalLiquido = mockFolhaMensal.reduce((acc, emp) => acc + emp.liquido, 0);

  const handleGerarFolha = () => {
    console.log("Folha gerada por:", user?.nome, "para", mesReferencia);
    toast.success("Folha de pagamento calculada e holerites gerados (PDFs simulados)!");
    setFolhaGerada(true);
  };

  return (
    <main className="payroll-container">
      <div className="payroll-header">
        <h1>Cálculo da Folha de Pagamento</h1>
        <p>RH: {user?.nome}</p>

        <div className="month-selector">
          <label>Mês de Referência:</label>
          <input 
            type="month" 
            value={mesReferencia} 
            onChange={(e) => setMesReferencia(e.target.value)}
          />
        </div>
      </div>

      {!folhaGerada ? (
        <div className="preview-section">
          <p>Pré-visualização da folha para {mesReferencia.replace("-", "/")}</p>
          <button className="btn-generate" onClick={handleGerarFolha}>
            Gerar Folha e Holerites
          </button>
        </div>
      ) : (
        <div className="generated-section">
          <p className="success">✅ Folha gerada com sucesso!</p>
          <div className="summary-cards">
            <div className="card">
              <strong>Total Bruto</strong>
              <p>R$ {totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="card">
              <strong>Total Descontos</strong>
              <p>R$ {totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="card">
              <strong>Total Líquido</strong>
              <p>R$ {totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}

      <h2>Detalhamento por Colaborador</h2>
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Cargo</th>
            <th>Salário Base</th>
            <th>Horas Extras</th>
            <th>Benefícios</th>
            <th>Descontos</th>
            <th>Líquido</th>
            <th>Holerite</th>
          </tr>
        </thead>
        <tbody>
          {mockFolhaMensal.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.nome}</td>
              <td>{emp.cargo}</td>
              <td>R$ {emp.salarioBase.toLocaleString('pt-BR')}</td>
              <td>{emp.horasExtras}h (R$ {emp.valorExtras})</td>
              <td>R$ {emp.beneficios.toLocaleString('pt-BR')}</td>
              <td>R$ {emp.descontos.toLocaleString('pt-BR')}</td>
              <td><strong>R$ {emp.liquido.toLocaleString('pt-BR')}</strong></td>
              <td>
                {folhaGerada && (
                  <button 
                    className="btn-pdf"
                    onClick={() => toast.info(`Holerite de ${emp.nome} baixado (mock PDF)`)}
                  >
                    📄 Download
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}