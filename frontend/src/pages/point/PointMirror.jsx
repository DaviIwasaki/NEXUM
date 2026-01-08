// src/pages/point/PointMirror.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../../styles/pages/point/pointMirror.css";

const mockEspelhoMensal = [
  { dia: "01/01", horas: 8, extras: 0 },
  { dia: "02/01", horas: 8, extras: 1 },
  { dia: "03/01", horas: 7, extras: 0 },
  { dia: "04/01", horas: 8, extras: 0 },
  { dia: "05/01", horas: 8, extras: 2 },
  { dia: "06/01", horas: 0, extras: 0 }, // fim de semana
  { dia: "07/01", horas: 0, extras: 0 },
  { dia: "08/01", horas: 8, extras: 0.5 },
  // ... até 31
];

export default function PointMirror() {
  const { user } = useAuth();
  const [mesSelecionado, setMesSelecionado] = useState("2026-01");
  const [pendenteAprovacao, setPendenteAprovacao] = useState(true);

  const totalHoras = mockEspelhoMensal.reduce((acc, dia) => acc + dia.horas, 0);
  const totalExtras = mockEspelhoMensal.reduce((acc, dia) => acc + dia.extras, 0);
  const bancoHoras = "+05:30"; // mock

  return (
    <main className="point-mirror-container">
      <h1>Espelho de Ponto</h1>
      <p>{user?.nome} • Mês: {mesSelecionado.replace("-", "/")}</p>

      <div className="summary-cards">
        <div className="card">
          <strong>Total de Horas</strong>
          <p>{totalHoras}h</p>
        </div>
        <div className="card">
          <strong>Horas Extras</strong>
          <p>{totalExtras}h</p>
        </div>
        <div className="card">
          <strong>Banco de Horas</strong>
          <p className={bancoHoras.startsWith("+") ? "positivo" : "negativo"}>{bancoHoras}</p>
        </div>
      </div>

      {user?.role === "Gestor" && pendenteAprovacao && (
        <div className="approval-pending">
          <p>⚠️ Ajustes pendentes de aprovação</p>
          <button>Aprovar Ajustes</button>
          <button className="btn-reject">Rejeitar</button>
        </div>
      )}

      <h2>Registro Diário</h2>
      <table className="point-table">
        <thead>
          <tr>
            <th>Dia</th>
            <th>Entrada</th>
            <th>Saída Intervalo</th>
            <th>Retorno Intervalo</th>
            <th>Saída</th>
            <th>Horas Trabalhadas</th>
            <th>Horas Extras</th>
            <th>Justificativa</th>
          </tr>
        </thead>
        <tbody>
          {mockEspelhoMensal.map((dia, idx) => (
            <tr key={idx}>
              <td>{dia.dia}</td>
              <td>08:00</td>
              <td>{dia.horas > 0 ? "12:00" : "-"}</td>
              <td>{dia.horas > 0 ? "13:00" : "-"}</td>
              <td>{dia.horas > 0 ? "17:00" : "-"}</td>
              <td>{dia.horas}h</td>
              <td>{dia.extras > 0 ? `+${dia.extras}h` : "-"}</td>
              <td>{idx === 1 ? "Consulta médica" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Banco de Horas - Evolução Mensal</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[
          { mes: "Out/25", horas: -2 },
          { mes: "Nov/25", horas: 1 },
          { mes: "Dez/25", horas: 3 },
          { mes: "Jan/26", horas: 5.5 },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="horas" fill="#009ADB" />
        </BarChart>
      </ResponsiveContainer>
    </main>
  );
}