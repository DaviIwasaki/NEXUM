// src/pages/payroll/PayslipIndividual.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/payroll/payslipIndividual.css";

const mockHolerite = {
  colaborador: "João Silva",
  cargo: "Desenvolvedor Frontend Pleno",
  departamento: "TI",
  mesReferencia: "Janeiro/2026",
  salarioBase: 10500.00,
  horasExtras: 8,
  valorHorasExtras: 1050.00,
  beneficios: {
    valeRefeicao: 800.00,
    valeTransporte: 300.00,
    planoSaude: 400.00,
    total: 1500.00,
  },
  descontos: {
    inss: 1200.00,
    irrf: 650.00,
    outros: 0.00,
    total: 1850.00,
  },
  liquido: 12200.00,
};

export default function PayslipIndividual() {
  const { id } = useParams(); // opcional: id do colaborador (para RH)
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwnPayslip = user?.role === "Colaborador";
  const canSendEmail = user?.role === "RH" || user?.role === "Admin";

  const handleDownloadPDF = () => {
    toast.success("Holerite baixado como PDF (simulação jsPDF)");
    // Futuro: usar jsPDF para gerar real
  };

  const handleSendEmail = () => {
    toast.success(`Holerite de ${mockHolerite.colaborador} enviado por e-mail.`);
  };

  return (
    <main className="payslip-container">
      <button onClick={() => navigate(-1)}>← Voltar</button>

      <div className="payslip-header">
        <h1>Holerite - {mockHolerite.mesReferencia}</h1>
        <p>
          <strong>{mockHolerite.colaborador}</strong> • {mockHolerite.cargo} • {mockHolerite.departamento}
        </p>
      </div>

      <div className="payslip-content">
        <section className="section-proventos">
          <h2>Proventos</h2>
          <table>
            <tbody>
              <tr><td>Salário Base</td><td>R$ {mockHolerite.salarioBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
              <tr><td>Horas Extras ({mockHolerite.horasExtras}h)</td><td>R$ {mockHolerite.valorHorasExtras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
              <tr><td><strong>Total Proventos</strong></td><td><strong>R$ {(mockHolerite.salarioBase + mockHolerite.valorHorasExtras).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></td></tr>
            </tbody>
          </table>
        </section>

        <section className="section-beneficios">
          <h2>Benefícios</h2>
          <table>
            <tbody>
              <tr><td>Vale Refeição</td><td>R$ {mockHolerite.beneficios.valeRefeicao.toFixed(2)}</td></tr>
              <tr><td>Vale Transporte</td><td>R$ {mockHolerite.beneficios.valeTransporte.toFixed(2)}</td></tr>
              <tr><td>Plano de Saúde</td><td>R$ {mockHolerite.beneficios.planoSaude.toFixed(2)}</td></tr>
              <tr><td><strong>Total Benefícios</strong></td><td><strong>R$ {mockHolerite.beneficios.total.toFixed(2)}</strong></td></tr>
            </tbody>
          </table>
        </section>

        <section className="section-descontos">
          <h2>Descontos</h2>
          <table>
            <tbody>
              <tr><td>INSS</td><td>R$ {mockHolerite.descontos.inss.toFixed(2)}</td></tr>
              <tr><td>IRRF</td><td>R$ {mockHolerite.descontos.irrf.toFixed(2)}</td></tr>
              <tr><td>Outros</td><td>R$ {mockHolerite.descontos.outros.toFixed(2)}</td></tr>
              <tr><td><strong>Total Descontos</strong></td><td><strong>R$ {mockHolerite.descontos.total.toFixed(2)}</strong></td></tr>
            </tbody>
          </table>
        </section>

        <section className="section-liquido">
          <h2>Valor Líquido a Receber</h2>
          <div className="valor-liquido">
            R$ {mockHolerite.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </section>
      </div>

      <div className="payslip-actions">
        <button className="btn-download" onClick={handleDownloadPDF}>
          📄 Baixar Holerite (PDF)
        </button>
        {canSendEmail && (
          <button className="btn-email" onClick={handleSendEmail}>
            📧 Enviar por E-mail
          </button>
        )}
      </div>
    </main>
  );
}