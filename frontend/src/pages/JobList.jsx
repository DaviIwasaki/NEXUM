// src/pages/JobList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { toast } from "react-toastify";
import "../styles/pages/jobList.css";

const JobList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Aumentei para 10, fica melhor com dados reais

  // Token e API base
  const token = localStorage.getItem("nexum_token");
  const apiBase = "http://localhost:8000";

  // Função auxiliar para fetch autenticado
  const fetchWithToken = async (endpoint) => {
    if (!token) throw new Error("Token não encontrado");
    const response = await fetch(`${apiBase}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Erro ${response.status}`);
    }
    return response.json();
  };

  // Carrega as vagas do backend
  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      setError(null);
      try {
        // Endpoint principal: /jobs (você precisa criar esse endpoint no backend)
        // Se ainda não existir, veja a sugestão abaixo
        const data = await fetchWithToken("/jobs");
        // O backend deve retornar algo como:
        // [{ id, titulo, status, data_abertura, num_candidatos }]
        setVagas(data);
      } catch (err) {
        console.error("[JobList] Erro ao carregar vagas:", err);
        toast.error(err.message || "Falha ao carregar lista de vagas");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, []);

  // Filtragem (client-side por enquanto - eficiente para poucas vagas)
  const filteredVagas = useMemo(() => {
    return vagas.filter((vaga) => {
      const statusMatch = statusFilter ? vaga.status === statusFilter : true;

      let dateMatch = true;
      if (dateFilter.from || dateFilter.to) {
        const vagaDate = new Date(vaga.data_abertura);
        const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
        const toDate = dateFilter.to ? new Date(dateFilter.to) : null;

        dateMatch =
          (!fromDate || vagaDate >= fromDate) &&
          (!toDate || vagaDate <= toDate);
      }

      return statusMatch && dateMatch;
    });
  }, [vagas, statusFilter, dateFilter]);

  // Paginação
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

  // Reset página ao mudar filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter]);

  if (loading) {
    return <div className="loading">Carregando vagas...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

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
          placeholder="De"
        />
        <input
          type="date"
          value={dateFilter.to}
          onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
          placeholder="Até"
        />
      </div>

      {filteredVagas.length === 0 ? (
        <p className="no-results">Nenhuma vaga encontrada com os filtros aplicados.</p>
      ) : (
        <>
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
                <tr
                  key={vaga.id}
                  className="clickable-row"
                  onClick={() => goToDetails(vaga.id)}
                >
                  <td>{vaga.titulo}</td>
                  <td>
                    <span className={`status-badge ${vaga.status?.toLowerCase() || "aberta"}`}>
                      {vaga.status || "Aberta"}
                    </span>
                  </td>
                  <td>{vaga.data_abertura ? new Date(vaga.data_abertura).toLocaleDateString("pt-BR") : "-"}</td>
                  <td>{vaga.num_candidatos ?? 0}</td>
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
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {pageCount}
              </span>
              <button
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default JobList;