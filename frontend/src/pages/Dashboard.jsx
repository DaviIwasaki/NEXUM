import { useEffect, useState } from "react";
import "../styles/pages/dashboard.css";

const mockDataByRole = {
  candidato: {
    greeting: "Bem-vindo(a), candidato 👋",
    candidaturas: [
      { vaga: "Desenvolvedor Frontend", status: "Em análise" },
      { vaga: "Analista de Dados", status: "Entrevista RH" }
    ]
  },
  rh: {
    greeting: "Painel RH",
    metrics: {
      vagasAbertas: 5,
      candidatosAtivos: 42,
      processosEmAndamento: 3
    }
  },
  admin: {
    greeting: "Painel Administrativo",
    metrics: {
      empresas: 12,
      usuarios: 128,
      vagas: 34
    }
  }
};

export default function Dashboard() {
  // depois isso vem do authStore
  const role = "rh"; // candidato | rh | admin
  const [data, setData] = useState(null);

  useEffect(() => {
    // mock fetch
    setTimeout(() => {
      setData(mockDataByRole[role]);
    }, 400);
  }, [role]);

  if (!data) {
    return <div className="dashboard-loading">Carregando dashboard...</div>;
  }

  return (
    <main className="dashboard-container">
      <section className="dashboard-header">
        <h1>{data.greeting}</h1>
        <p className="dashboard-subtitle">
          Aqui está um resumo rápido do sistema hoje
        </p>
      </section>

      {/* Cards métricas */}
      {data.metrics && (
        <section className="dashboard-cards">
          {Object.entries(data.metrics).map(([key, value]) => (
            <div key={key} className="dashboard-card">
              <span className="card-label">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <strong className="card-value">{value}</strong>
            </div>
          ))}
        </section>
      )}

      {/* Área específica por papel */}
      {role === "candidato" && (
        <section className="dashboard-section">
          <h2>Minhas Candidaturas</h2>
          <div className="dashboard-list">
            {data.candidaturas.map((c, idx) => (
              <div key={idx} className="dashboard-list-card">
                <span>{c.vaga}</span>
                <span className="status">{c.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {role === "rh" && (
        <section className="dashboard-section">
          <h2>Ações rápidas</h2>
          <div className="dashboard-actions">
            <button className="action-btn">Criar nova vaga</button>
            <button className="action-btn secondary">
              Ver processos seletivos
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
