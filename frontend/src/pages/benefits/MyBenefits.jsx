// src/pages/benefits/MyBenefits.jsx
import React from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/benefits/myBenefits.css";

const mockMeusBeneficios = [
  {
    nome: "Vale Refeição",
    custoColaborador: "R$ 0,00",
    custoEmpresa: "R$ 40,00/dia",
    status: "Ativo",
    dataAdesao: "2025-03-01",
  },
  {
    nome: "Vale Transporte",
    custoColaborador: "R$ 198,00",
    custoEmpresa: "R$ 800,00",
    status: "Pendente aprovação",
    dataAdesao: "2026-01-05",
  },
  {
    nome: "Plano de Saúde",
    custoColaborador: "R$ 200,00",
    custoEmpresa: "R$ 600,00",
    status: "Ativo",
    dataAdesao: "2026-03-01",
    dependentes: ["Maria Silva (Cônjuge)", "Pedro Silva (Filho)"],
  },
];

export default function MyBenefits() {
  const { user } = useAuth();

  const canApprove = user?.role === "RH" || user?.role === "Admin";

  const handleAprovar = (beneficio) => {
    toast.success(`${beneficio.nome} aprovado para ${user?.nome}`);
  };

  const totalCustoColaborador = mockMeusBeneficios.reduce((acc, b) => {
    const valor = parseFloat(b.custoColaborador.replace("R$ ", "").replace(",", "."));
    return acc + valor;
  }, 0);

  return (
    <main className="my-benefits-container">
      <h1>Meus Benefícios</h1>
      <p>{user?.nome} • Custo mensal total para você: R$ {totalCustoColaborador.toFixed(2).replace(".", ",")}</p>

      <table className="benefits-table">
        <thead>
          <tr>
            <th>Benefício</th>
            <th>Custo Colaborador</th>
            <th>Custo Empresa</th>
            <th>Status</th>
            <th>Data Adesão</th>
            <th>Dependentes</th>
            {canApprove && <th>Ação</th>}
          </tr>
        </thead>
        <tbody>
          {mockMeusBeneficios.map((beneficio, idx) => (
            <tr key={idx}>
              <td><strong>{beneficio.nome}</strong></td>
              <td>{beneficio.custoColaborador}</td>
              <td>{beneficio.custoEmpresa}</td>
              <td>
                <span className={`status-badge ${beneficio.status.toLowerCase().replace(" ", "-")}`}>
                  {beneficio.status}
                </span>
              </td>
              <td>{beneficio.dataAdesao}</td>
              <td>
                {beneficio.dependentes ? beneficio.dependentes.join(", ") : "-"}
              </td>
              {canApprove && beneficio.status.includes("Pendente") && (
                <td>
                  <button className="btn-approve" onClick={() => handleAprovar(beneficio)}>
                    Aprovar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}