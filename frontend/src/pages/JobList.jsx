// src/pages/JobList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/jobList.css";

const mockVagas = [
  { id: 1, titulo: "Desenvolvedor Frontend", status: "Aberta", dataAbertura: "2026-01-01", candidatos: 12 },
  { id: 2, titulo: "Analista de Dados", status: "Aberta", dataAbertura: "2026-01-03", candidatos: 8 },
  { id: 3, titulo: "RH Pleno", status: "Fechada", dataAbertura: "2026-01-05", candidatos: 5 },
  { id: 4, titulo: "Product Manager", status: "Aberta", dataAbertura: "2026-01-06", candidatos: 15 },
  { id: 5, titulo: "Designer UX/UI", status: "Aberta", dataAbertura: "2026-01-07", candidatos: 9 },
];

const JobList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const pageCount = Math.ceil(filteredVagas.length / itemsPerPage);
  const paginatedVagas = filteredVagas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToDetails = (id) => {
    navigate(`/vagas/${id}`);
  };

  const goToCreateJob = () => {
    navigate("/vagas/nova");
  };

  return (
    <main className="joblist-container">
      <div className="joblist-header">
        <h1>Lista de Vagas</h1>
        {user?.role === "RH" && (
          <button className="btn-new" onClick={goToCreateJob}>
            + Nova Vaga
          </button>
        )}
      </div>

      <div className="joblist-filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="Aberta">Aberta</option>
          <option value="Fechada">Fechada</option>
        </select>
        <input
          type="date"
          value={dateFilter.from}
          onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
        />
        <input
          type="date"
          value={dateFilter.to}
          onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
        />
      </div>

      <table className="joblist-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Data Abertura</th>
            <th>Nº Candidatos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginatedVagas.map((vaga) => (
            <tr key={vaga.id} className="clickable-row" onClick={() => goToDetails(vaga.id)}>
              <td>{vaga.titulo}</td>
              <td>
                <span className={`status-badge ${vaga.status.toLowerCase()}`}>
                  {vaga.status}
                </span>
              </td>
              <td>{vaga.dataAbertura}</td>
              <td>{vaga.candidatos}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button className="btn-details" onClick={() => goToDetails(vaga.id)}>
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {pageCount > 1 && (
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
      )}
    </main>
  );
};

export default JobList;