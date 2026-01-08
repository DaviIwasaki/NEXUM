// src/pages/employees/EmployeeList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import "../../styles/pages/employees/employeeList.css";

const mockColaboradores = [
  {
    id: 501,
    nome: "João Silva",
    cargo: "Desenvolvedor Frontend",
    departamento: "TI",
    status: "Ativo",
    admissao: "2025-03-01",
  },
  {
    id: 502,
    nome: "Maria Oliveira",
    cargo: "Analista de RH",
    departamento: "Recursos Humanos",
    status: "Ativo",
    admissao: "2024-11-15",
  },
  {
    id: 503,
    nome: "Pedro Santos",
    cargo: "Product Manager",
    departamento: "Produto",
    status: "Afastado",
    admissao: "2024-06-20",
  },
  {
    id: 504,
    nome: "Ana Costa",
    cargo: "Designer UX",
    departamento: "Design",
    status: "Ativo",
    admissao: "2025-01-10",
  },
  {
    id: 505,
    nome: "Lucas Ferreira",
    cargo: "DevOps Engineer",
    departamento: "TI",
    status: "Desligado",
    admissao: "2023-08-01",
  },
];

export default function EmployeeList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const departamentosUnicos = [...new Set(mockColaboradores.map(c => c.departamento))];
  const statusUnicos = ["Ativo", "Afastado", "Desligado"];

  const filteredColaboradores = useMemo(() => {
    return mockColaboradores.filter((col) => {
      const deptMatch = deptFilter ? col.departamento === deptFilter : true;
      const statusMatch = statusFilter ? col.status === statusFilter : true;
      return deptMatch && statusMatch;
    });
  }, [deptFilter, statusFilter]);

  const pageCount = Math.ceil(filteredColaboradores.length / itemsPerPage);
  const paginated = filteredColaboradores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToProfile = (id) => {
    navigate(`/colaboradores/${id}`);
  };

  const goToNewEmployee = () => {
    navigate("/colaboradores/novo");
  };

  return (
    <main className="employee-list-container">
      <div className="employee-list-header">
        <h1>Colaboradores</h1>
        {(user?.role === "RH" || user?.role === "Admin") && (
          <button onClick={goToNewEmployee} className="btn-new">
            + Novo Colaborador
          </button>
        )}
      </div>

      <div className="filters">
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">Todos os Departamentos</option>
          {departamentosUnicos.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos os Status</option>
          {statusUnicos.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Status</th>
            <th>Admissão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((col) => (
            <tr key={col.id} onClick={() => goToProfile(col.id)} className="clickable-row">
              <td>{col.nome}</td>
              <td>{col.cargo}</td>
              <td>{col.departamento}</td>
              <td>
                <span className={`status-badge ${col.status.toLowerCase()}`}>
                  {col.status}
                </span>
              </td>
              <td>{col.admissao}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button onClick={() => goToProfile(col.id)}>
                  Ver Perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="pagination">
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
}