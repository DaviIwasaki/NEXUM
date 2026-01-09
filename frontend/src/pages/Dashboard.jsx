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
    const fetchDashboardData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // simula latência de API

      const baseData = {
        Candidato: {
          greeting: `Bem-vindo de volta, ${user?.nome?.split(' ')[0] || 'Candidato'}!`,
          cards: [
            { label: "Candidaturas Ativas", value: "3" },
            { label: "Status Atual", value: "Em processo seletivo" },
            { label: "Próximo Prazo", value: "Entrevista em 3 dias" },
          ],
          actions: [
            { label: "Ver Vagas Disponíveis", path: "/vagas" },
            { label: "Meu Perfil", path: "/perfil" },
          ],
          chartTitle: "Progresso das Minhas Candidaturas",
          chartData: [
            { mes: "Out/25", candidaturas: 1 },
            { mes: "Nov/25", candidaturas: 3 },
            { mes: "Dez/25", candidaturas: 5 },
            { mes: "Jan/26", candidaturas: 4 },
          ],
        },
        Colaborador: {
          greeting: `Olá, ${user?.nome?.split(' ')[0] || 'Colaborador'}!`,
          cards: [
            { label: "Banco de Horas Atual", value: "+05:30h" },
            { label: "Próxima Avaliação", value: "Semestral 2/2026" },
            { label: "Treinamentos Pendentes", value: "2" },
            { label: "Solicitações de Saúde", value: "1 pendente" },
          ],
          actions: [
            { label: "Registrar Ponto", path: "/ponto" },
            { label: "Ver Espelho de Ponto", path: "/espelho-ponto" },
            { label: "Meus Benefícios", path: "/meus-beneficios" },
            { label: "Meu PDI", path: "/pdi" },
            { label: "Solicitar Saúde", path: "/saude/solicitacoes" },
          ],
          chartTitle: "Evolução do Banco de Horas (últimos 4 meses)",
          chartData: [
            { mes: "Out/25", horas: 2 },
            { mes: "Nov/25", horas: 5 },
            { mes: "Dez/25", horas: 8 },
            { mes: "Jan/26", horas: 5.5 },
          ],
        },
        RH: {
          greeting: "Painel de Recursos Humanos",
          cards: [
            { label: "Vagas Abertas", value: "7" },
            { label: "Candidatos Ativos", value: "58" },
            { label: "Processos em Andamento", value: "5" },
            { label: "Contratações no Mês", value: "3" },
          ],
          actions: [
            { label: "Criar Nova Vaga", path: "/vagas/nova" },
            { label: "Ver Colaboradores", path: "/colaboradores" },
            { label: "Cálculo da Folha", path: "/folha-calculo" },
            { label: "Relatórios Fiscais", path: "/relatorios-fiscais" },
          ],
          chartTitle: "Candidatos por Etapa (média das vagas)",
          chartData: [
            { etapa: "Triagem", candidatos: 22 },
            { etapa: "Entrevista RH", candidatos: 15 },
            { etapa: "Teste Técnico", candidatos: 12 },
            { etapa: "Entrevista Final", candidatos: 6 },
          ],
        },
        Gestor: {
          greeting: "Painel do Gestor",
          cards: [
            { label: "Vagas da Área", value: "4" },
            { label: "Candidatos para Avaliar", value: "18" },
            { label: "Entrevistas Pendentes", value: "8" },
            { label: "Aprovações de Saúde Pendentes", value: "2" },
          ],
          actions: [
            { label: "Aprovações Pendentes", path: "/aprovacoes-pendentes" },
            { label: "Ciclos de Avaliação", path: "/ciclos-avaliacao" },
            { label: "Minha Equipe", path: "/colaboradores" },
          ],
          chartTitle: "Aprovações por Mês",
          chartData: [
            { mes: "Out/25", aprovados: 2 },
            { mes: "Nov/25", aprovados: 5 },
            { mes: "Dez/25", aprovados: 3 },
            { mes: "Jan/26", aprovados: 6 },
          ],
        },
        Admin: {
          greeting: "Painel Administrativo",
          cards: [
            { label: "Empresas Cadastradas", value: "18" },
            { label: "Usuários Totais", value: "342" },
            { label: "Vagas Ativas", value: "42" },
            { label: "Logs Últimas 24h", value: "156" },
          ],
          actions: [
            { label: "Nova Empresa", path: "/empresas/nova" },
            { label: "Usuários e Permissões", path: "/config/usuarios" },
            { label: "Cargos e Departamentos", path: "/config/cargos-departamentos" },
          ],
          chartTitle: "Crescimento de Usuários (mensal)",
          chartData: [
            { mes: "Set/25", usuarios: 280 },
            { mes: "Out/25", usuarios: 295 },
            { mes: "Nov/25", usuarios: 315 },
            { mes: "Dez/25", usuarios: 330 },
            { mes: "Jan/26", usuarios: 342 },
          ],
        },
        Auditor: {
          greeting: "Painel de Auditoria",
          cards: [
            { label: "Logs Processados Últimas 24h", value: "156" },
            { label: "Consentimentos LGPD Pendentes", value: "4" },
            { label: "Acessos Suspeitos Detectados", value: "2" },
            { label: "Relatórios de Compliance Gerados", value: "8" },
          ],
          actions: [
            { label: "Ver Logs Completos", path: "/logs" },
            { label: "Relatórios Compliance", path: "/relatorios/compliance" },
          ],
          chartTitle: "Evolução de Acessos a Dados Pessoais",
          chartData: [
            { mes: "Out/25", acessos: 120 },
            { mes: "Nov/25", acessos: 145 },
            { mes: "Dez/25", acessos: 180 },
            { mes: "Jan/26", acessos: 210 },
          ],
        },
      };

      const roleData = baseData[user?.role] || baseData.Candidato;
      setMetrics(roleData);
      setChartData(roleData.chartData);
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <div className="dashboard-loading">Carregando seu painel...</div>;
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

      {/* Cards de métricas - sempre presentes */}
      {metrics.cards && (
        <section className="dashboard-cards">
          {metrics.cards.map((card, idx) => (
            <div key={idx} className="dashboard-card">
              <span className="card-label">{card.label}</span>
              <strong className="card-value">{card.value}</strong>
            </div>
          ))}
        </section>
      )}

      {/* Gráfico - sempre com dados */}
      {chartData.length > 0 && (
        <section className="dashboard-chart">
          <h2>{metrics.chartTitle}</h2>
          <ResponsiveContainer width="100%" height={300}>
            {user?.role === "RH" || user?.role === "Gestor" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={user?.role === "RH" ? "candidatos" : "aprovados"} fill="#009ADB" />
              </BarChart>
            ) : user?.role === "Auditor" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="acessos" fill="#ff4d4f" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={user?.role === "Colaborador" ? "horas" : "candidaturas"} stroke="#212145" strokeWidth={3} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </section>
      )}

      {/* Ações rápidas - sempre presentes e relevantes */}
      {metrics.actions && (
        <section className="dashboard-section">
          <h2>Ações Rápidas</h2>
          <div className="dashboard-actions">
            {metrics.actions.map((action, idx) => (
              <button 
                key={idx} 
                className="action-btn" 
                onClick={() => navigate(action.path)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}