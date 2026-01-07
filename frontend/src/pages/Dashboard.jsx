// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/pages/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula fetch de dados da API com delay
    const fetchDashboardData = async () => {
      setLoading(true);

      // Dados simulados dinâmicos por role
      await new Promise(resolve => setTimeout(resolve, 800)); // simula latência

      const baseMetrics = {
        Candidato: {
          greeting: `Bem-vindo de volta, ${user?.nome?.split(' ')[0] || 'Candidato'}!`,
          candidaturas: [
            { vaga: "Desenvolvedor Frontend", status: "Entrevista Técnica", data: "07/01/2026" },
            { vaga: "Analista de Dados", status: "Em análise", data: "05/01/2026" },
            { vaga: "UX Designer", status: "Triagem", data: "03/01/2026" },
          ],
          chartTitle: "Progresso das suas candidaturas",
          chartData: [
            { mes: "Out", candidaturas: 2 },
            { mes: "Nov", candidaturas: 4 },
            { mes: "Dez", candidaturas: 3 },
            { mes: "Jan", candidaturas: 5 },
          ],
        },
        RH: {
          greeting: "Painel de Recursos Humanos",
          metrics: {
            vagasAbertas: 7,
            candidatosAtivos: 58,
            processosEmAndamento: 5,
            contrataçõesMes: 3,
          },
          chartTitle: "Candidatos por etapa (vaga média)",
          chartData: [
            { etapa: "Triagem", candidatos: 22 },
            { etapa: "Entrevista RH", candidatos: 15 },
            { etapa: "Teste Técnico", candidatos: 12 },
            { etapa: "Entrevista Final", candidatos: 6 },
            { etapa: "Oferta", candidatos: 3 },
          ],
        },
        Gestor: {
          greeting: "Painel do Gestor",
          metrics: {
            vagasDaArea: 4,
            candidatosParaAvaliar: 18,
            entrevistasPendentes: 8,
            aprovadosMes: 4,
          },
          chartTitle: "Aprovações por mês",
          chartData: [
            { mes: "Out", aprovados: 2 },
            { mes: "Nov", aprovados: 5 },
            { mes: "Dez", aprovados: 3 },
            { mes: "Jan", aprovados: 6 },
          ],
        },
        Admin: {
          greeting: "Painel Administrativo",
          metrics: {
            empresasCadastradas: 18,
            usuariosTotais: 342,
            vagasAtivas: 42,
            logsUltimas24h: 156,
          },
          chartTitle: "Crescimento de usuários",
          chartData: [
            { mes: "Set", usuarios: 280 },
            { mes: "Out", usuarios: 295 },
            { mes: "Nov", usuarios: 315 },
            { mes: "Dez", usuarios: 330 },
            { mes: "Jan", usuarios: 342 },
          ],
        },
      };

      const roleData = baseMetrics[user?.role] || baseMetrics.Candidato;
      setMetrics(roleData);
      setChartData(roleData.chartData);
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <div className="dashboard-loading">Carregando seus dados...</div>;
  }

  if (!metrics) return null;

  return (
    <main className="dashboard-container">
      <section className="dashboard-header">
        <h1>{metrics.greeting} 👋</h1>
        <p className="dashboard-subtitle">
          Visão geral atualizada em tempo real • {new Date().toLocaleDateString('pt-BR')}
        </p>
      </section>

      {/* Métricas em cards */}
      {metrics.metrics && (
        <section className="dashboard-cards">
          {Object.entries(metrics.metrics).map(([key, value]) => (
            <div key={key} className="dashboard-card">
              <span className="card-label">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, str => str.toUpperCase())}
              </span>
              <strong className="card-value">{value}</strong>
            </div>
          ))}
        </section>
      )}

      {/* Gráfico dinâmico */}
      <section className="dashboard-chart">
        <h2>{metrics.chartTitle}</h2>
        <ResponsiveContainer width="100%" height={300}>
          {user?.role === "Candidato" || user?.role === "Gestor" || user?.role === "Admin" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={user?.role === "RH" ? "etapa" : "mes"} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={user?.role === "RH" ? "candidatos" : user?.role === "Gestor" ? "aprovados" : "usuarios"} stroke="#212145" strokeWidth={3} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="etapa" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="candidatos" fill="#009ADB" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </section>

      {/* Área específica por papel */}
      {user?.role === "Candidato" && metrics.candidaturas && (
        <section className="dashboard-section">
          <h2>Minhas Candidaturas Recentes</h2>
          <div className="dashboard-list">
            {metrics.candidaturas.map((c, idx) => (
              <div key={idx} className="dashboard-list-card">
                <div>
                  <strong>{c.vaga}</strong>
                  <p>{c.data}</p>
                </div>
                <span className={`status ${c.status.toLowerCase().replace(' ', '-')}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(user?.role === "RH" || user?.role === "Gestor") && (
        <section className="dashboard-section">
          <h2>Ações Rápidas</h2>
          <div className="dashboard-actions">
            {user?.role === "RH" && (
              <button className="action-btn" onClick={() => navigate("/vagas/nova")}>
                Criar Nova Vaga
              </button>
            )}
            <button className="action-btn secondary" onClick={() => navigate("/vagas")}>
              Ver Todas as Vagas
            </button>
            <button className="action-btn secondary" onClick={() => navigate("/logs")}>
              Ver Logs de Auditoria
            </button>
          </div>
        </section>
      )}
    </main>
  );
}