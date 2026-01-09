// src/pages/reports/ComplianceReports.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/reports/complianceReports.css";

const mockConsentimentosLGPD = [
  {
    id: 1,
    colaborador: "João Silva",
    dataConsentimento: "2025-03-01",
    tipo: "Tratamento de dados pessoais",
    status: "Válido",
    ultimaAtualizacao: "2026-01-01",
  },
  {
    id: 2,
    colaborador: "Maria Oliveira",
    dataConsentimento: "2024-11-15",
    tipo: "Compartilhamento com terceiros",
    status: "Revogado",
    ultimaAtualizacao: "2025-12-20",
  },
  {
    id: 3,
    colaborador: "Pedro Santos",
    dataConsentimento: "2024-06-20",
    tipo: "Todos os tratamentos",
    status: "Válido",
    ultimaAtualizacao: "2025-06-20",
  },
];

const mockAcessosDados = [
  {
    id: 1,
    usuario: "Ana Souza (RH)",
    dataAcesso: "2026-01-08 14:30",
    colaboradorAcessado: "João Silva",
    motivo: "Atualização cadastral",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    usuario: "Carlos Lima (Gestor)",
    dataAcesso: "2026-01-07 10:15",
    colaboradorAcessado: "Maria Oliveira",
    motivo: "Avaliação de desempenho",
    ip: "192.168.1.105",
  },
  {
    id: 3,
    usuario: "Admin Master (Admin)",
    dataAcesso: "2026-01-06 09:00",
    colaboradorAcessado: "Todos",
    motivo: "Backup de dados",
    ip: "192.168.1.1",
  },
];

export default function ComplianceReports() {
  const { user } = useAuth();

  return (
    <main className="compliance-reports-container">
      <h1>Relatórios de Compliance & LGPD</h1>
      <p>Auditor/RH: {user?.nome} • Visão geral de consentimentos e acessos a dados</p>

      <section className="section-consents">
        <h2>Consentimentos LGPD</h2>
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Data Consentimento</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {mockConsentimentosLGPD.map((consent) => (
              <tr key={consent.id}>
                <td>{consent.colaborador}</td>
                <td>{consent.dataConsentimento}</td>
                <td>{consent.tipo}</td>
                <td>
                  <span className={`status-badge ${consent.status.toLowerCase()}`}>
                    {consent.status}
                  </span>
                </td>
                <td>{consent.ultimaAtualizacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section-access">
        <h2>Log de Acessos a Dados Pessoais</h2>
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Data/Hora Acesso</th>
              <th>Colaborador Acessado</th>
              <th>Motivo</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {mockAcessosDados.map((acesso) => (
              <tr key={acesso.id}>
                <td>{acesso.usuario}</td>
                <td>{acesso.dataAcesso}</td>
                <td>{acesso.colaboradorAcessado}</td>
                <td>{acesso.motivo}</td>
                <td>{acesso.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="report-actions">
        <button onClick={() => toast.info("Relatório LGPD exportado como PDF (mock)")}>
          Exportar Relatório Completo (PDF)
        </button>
        <button onClick={() => toast.info("Dados exportados como CSV (mock)")}>
          Exportar para CSV
        </button>
      </div>
    </main>
  );
}