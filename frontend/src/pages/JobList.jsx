// src/pages/jobs/JobList.jsx
import React, { useState, useMemo } from "react";
import "../styles/pages/jobList.css";

const mockVagas = [
  {
    id: 1,
    titulo: "Desenvolvedor Frontend",
    status: "Aberta",
    dataAbertura: "2026-01-01",
    candidatos: 5,
  },
  {
    id: 2,
    titulo: "Analista de Dados",
    status: "Fechada",
    dataAbertura: "2026-01-03",
    candidatos: 3,
  },
  {
    id: 3,
    titulo: "RH Pleno",
    status: "Aberta",
    dataAbertura: "2026-01-05",
    candidatos: 2,
  },
  // ... adicione mais mock se quiser testar paginação
];

const JobList = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVagas = useMemo(() => {
    return mockVagas.filter((vaga) => {
      const statusMatch = statusFilter ? vaga.status === statusFilter : true;

      const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
      const toDate = dateFilter.to ? new Date(dateFilter.to) : null;
      const vagaDate = new Date(vaga.dataAbertura);

      const dateMatch =
        (!fromDate || vagaDate >= fromDate) && (!toDate || vagaDate <= toDate);

      return statusMatch && dateMatch;
    });
  }, [statusFilter, dateFilter]);

  // Paginação fake
  const pageCount = Math.ceil(filteredVagas.length / itemsPerPage);
  const paginatedVagas = filteredVagas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (id) => {
    alert(`Clique na vaga ID: ${id} → aqui entraria Detalhes da Vaga`);
  };

  return (
    <>
      <main className="joblist-container">
        <div className="joblist-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="Aberta">Aberta</option>
            <option value="Fechada">Fechada</option>
          </select>
          <input
            type="date"
            value={dateFilter.from}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, from: e.target.value })
            }
            placeholder="De"
          />
          <input
            type="date"
            value={dateFilter.to}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, to: e.target.value })
            }
            placeholder="Até"
          />
        </div>

        <table className="joblist-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Status</th>
              <th>Data Abertura</th>
              <th>Nº Candidatos</th>
              <th>Ações</th> {/* nova coluna */}
            </tr>
          </thead>
          <tbody>
            {paginatedVagas.map((vaga) => (
              <tr key={vaga.id}>
                <td>{vaga.id}</td>
                <td>{vaga.titulo}</td>
                <td>{vaga.status}</td>
                <td>{vaga.dataAbertura}</td>
                <td>{vaga.candidatos}</td>
                <td>
                  <button
                    className="btn-details"
                    onClick={() => handleRowClick(vaga.id)}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="joblist-pagination">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Botão Nova Vaga (apenas RH) */}
        <div className="joblist-new">
          <button className="btn-new">Nova Vaga</button>
        </div>
      </main>
    </>
  );
};

export default JobList;
