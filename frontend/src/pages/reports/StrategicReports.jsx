// src/pages/reports/StrategicReports.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import "../../styles/pages/reports/strategicReports.css";

const dadosTurnover = [
  { mes: "Jan/25", taxa: 5.2 },
  { mes: "Fev/25", taxa: 4.8 },
  { mes: "Mar/25", taxa: 6.1 },
  { mes: "Abr/25", taxa: 5.5 },
  { mes: "Mai/25", taxa: 4.2 },
  { mes: "Jun/25", taxa: 5.0 },
  { mes: "Jul/25", taxa: 4.9 },
  { mes: "Ago/25", taxa: 5.3 },
  { mes: "Set/25", taxa: 6.0 },
  { mes: "Out/25", taxa: 5.7 },
  { mes: "Nov/25", taxa: 4.5 },
  { mes: "Dez/25", taxa: 5.8 },
];

const dadosAbsenteismo = [
  { mes: "Jan/25", taxa: 3.2 },
  { mes: "Fev/25", taxa: 4.1 },
  { mes: "Mar/25", taxa: 3.8 },
  { mes: "Abr/25", taxa: 3.5 },
  { mes: "Mai/25", taxa: 4.0 },
  { mes: "Jun/25", taxa: 3.7 },
  { mes: "Jul/25", taxa: 4.2 },
  { mes: "Ago/25", taxa: 3.9 },
  { mes: "Set/25", taxa: 4.5 },
  { mes: "Out/25", taxa: 4.0 },
  { mes: "Nov/25", taxa: 3.6 },
  { mes: "Dez/25", taxa: 5.1 },
];

const dadosHeadcount = [
  { mes: "Jan/25", colaboradores: 120 },
  { mes: "Fev/25", colaboradores: 122 },
  { mes: "Mar/25", colaboradores: 125 },
  { mes: "Abr/25", colaboradores: 128 },
  { mes: "Mai/25", colaboradores: 130 },
  { mes: "Jun/25", colaboradores: 132 },
];

export default function StrategicReports() {
  const { user } = useAuth();
  const [tipoRelatorio, setTipoRelatorio] = useState("turnover");

  const dadosAtuais = tipoRelatorio === "turnover" ? dadosTurnover :
                     tipoRelatorio === "absenteismo" ? dadosAbsenteismo :
                     dadosHeadcount;

  const titulo = tipoRelatorio === "turnover" ? "Turnover Mensal (%)" :
                tipoRelatorio === "absenteismo" ? "Absenteísmo Mensal (%)" :
                "Headcount (Número de Colaboradores)";

  const chaveDados = tipoRelatorio === "headcount" ? "colaboradores" : "taxa";

  const handleExport = (formato) => {
    toast.success(`Relatório ${titulo} exportado como ${formato.toUpperCase()} (simulação)`);
  };

  return (
    <main className="strategic-reports-container">
      <h1>Relatórios Estratégicos de RH</h1>
      <p>{user?.nome} • Indicadores chave para tomada de decisão</p>

      <div className="report-selector">
        <label>Tipo de Relatório:</label>
        <select value={tipoRelatorio} onChange={(e) => setTipoRelatorio(e.target.value)}>
          <option value="turnover">Turnover</option>
          <option value="absenteismo">Absenteísmo</option>
          <option value="headcount">Headcount / Evolução de Colaboradores</option>
          <option value="custo-colaborador">Custo Médio por Colaborador</option>
          <option value="tempo-contratacao">Tempo Médio de Contratação</option>
        </select>

        <div className="export-buttons">
          <button onClick={() => handleExport("csv")}>Exportar CSV</button>
          <button onClick={() => handleExport("pdf")}>Exportar PDF</button>
        </div>
      </div>

      <div className="chart-container">
        <h2>{titulo}</h2>
        <ResponsiveContainer width="100%" height={400}>
          {tipoRelatorio === "headcount" ? (
            <LineChart data={dadosAtuais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={chaveDados} stroke="#212145" strokeWidth={3} />
            </LineChart>
          ) : (
            <BarChart data={dadosAtuais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={chaveDados} fill="#009ADB" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <strong>Média Anual</strong>
          <p>{(dadosAtuais.reduce((acc, d) => acc + d[chaveDados], 0) / dadosAtuais.length).toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <strong>Maior Pico</strong>
          <p>{Math.max(...dadosAtuais.map(d => d[chaveDados])).toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <strong>Meta Corporativa</strong>
          <p>{tipoRelatorio === "turnover" ? "< 5%" : tipoRelatorio === "absenteismo" ? "< 4%" : "Crescimento 10%"}</p>
        </div>
      </div>
    </main>
  );
}