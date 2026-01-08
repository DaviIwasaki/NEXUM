// src/pages/payroll/FiscalReports.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/payroll/fiscalReports.css";

const mockRelatorios = [
  { nome: "eSocial - Eventos Periódicos", mes: "2026-01", status: "Gerado" },
  { nome: "DCTF", mes: "2026-01", status: "Pendente" },
  { nome: "GFIP/SEFIP", mes: "2026-01", status: "Gerado" },
  { nome: "DIRF", ano: "2026", status: "Não iniciado" },
];

export default function FiscalReports() {
  const { user } = useAuth();
  const [filtroMes, setFiltroMes] = useState("2026-01");
  const [filtroAno, setFiltroAno] = useState("2026");

  const handleExportCSV = (relatorio) => {
    toast.success(`${relatorio.nome} exportado como CSV`);
  };

  const handleExportPDF = (relatorio) => {
    toast.success(`${relatorio.nome} exportado como PDF`);
  };

  const handleGerar = (relatorio) => {
    toast.success(`${relatorio.nome} gerado com sucesso`);
  };

  return (
    <main className="fiscal-reports-container">
      <h1>Relatórios Fiscais e Obrigações</h1>
      <p>RH: {user?.nome}</p>

      <div className="filters">
        <label>
          Mês/Ano:
          <input type="month" value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} />
        </label>
        <label>
          Ano:
          <input type="text" value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)} placeholder="2026" />
        </label>
      </div>

      <table className="fiscal-table">
        <thead>
          <tr>
            <th>Relatório</th>
            <th>Período</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {mockRelatorios.map((rel, idx) => (
            <tr key={idx}>
              <td>{rel.nome}</td>
              <td>{rel.mes || rel.ano}</td>
              <td>
                <span className={`status-badge ${rel.status.toLowerCase()}`}>
                  {rel.status}
                </span>
              </td>
              <td className="actions">
                {rel.status === "Pendente" || rel.status === "Não iniciado" ? (
                  <button onClick={() => handleGerar(rel)}>Gerar</button>
                ) : (
                  <>
                    <button onClick={() => handleExportCSV(rel)}>CSV</button>
                    <button onClick={() => handleExportPDF(rel)}>PDF</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}