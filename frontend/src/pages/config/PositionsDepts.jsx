// src/pages/config/PositionsDepts.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/config/positionsDepts.css";

export default function PositionsDepts() {
  const { user } = useAuth();

  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [gerentesPossiveis, setGerentesPossiveis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [novoCargo, setNovoCargo] = useState({
    nome: "",
    nivel: "Júnior",
    departamento_id: "",
  });
  const [novoDept, setNovoDept] = useState({ nome: "", gerente_id: "" });

  const token = localStorage.getItem("nexum_token");
  const apiBase = "http://localhost:8000";

  const fetchWithToken = useCallback(async (endpoint, options = {}) => {
    if (!token) throw new Error("Token não encontrado");
    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.detail || `Erro ${response.status}`;
      throw new Error(msg);
    }
    return response.json();
  }, [token]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cargosData, deptsData, usersData] = await Promise.all([
        fetchWithToken("/config/cargos"),
        fetchWithToken("/config/departamentos"),
        fetchWithToken("/admin/users"),
      ]);

      setCargos(cargosData);
      setDepartamentos(deptsData);

      const gerentes = usersData.filter((u) =>
        ["GESTOR", "RH", "ADMIN"].includes(u.role)
      );
      setGerentesPossiveis(gerentes);
    } catch (err) {
      console.error("[PositionsDepts] Erro:", err);
      toast.error(err.message || "Falha ao carregar dados");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCargo = async () => {
    if (!novoCargo.nome.trim()) return toast.error("Nome do cargo obrigatório");
    if (!novoCargo.departamento_id)
      return toast.error("Selecione um departamento");

    try {
      const payload = {
        ...novoCargo,
        departamento_id: Number(novoCargo.departamento_id), // Converte string → int
      };
      await fetchWithToken("/config/cargos", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Cargo adicionado!");
      setNovoCargo({ nome: "", nivel: "Júnior", departamento_id: "" });
      loadData();
    } catch (err) {
      toast.error(err.message || "Falha ao adicionar cargo");
    }
  };

  const handleAddDepartamento = async () => {
    if (!novoDept.nome.trim())
      return toast.error("Nome do departamento obrigatório");

    try {
      const payload = {
        nome: novoDept.nome,
        gerente_id: novoDept.gerente_id ? Number(novoDept.gerente_id) : null, // Converte ou null
      };
      await fetchWithToken("/config/departamentos", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Departamento adicionado!");
      setNovoDept({ nome: "", gerente_id: "" });
      loadData();
    } catch (err) {
      toast.error(err.message || "Falha ao adicionar departamento");
    }
  };

  if (loading)
    return (
      <div className="loading">Carregando estrutura organizacional...</div>
    );
  if (error)
    return (
      <div className="error">
        Erro: {error}
        <button onClick={loadData}>Tentar novamente</button>
      </div>
    );

  return (
    <main className="positions-depts-container">
      <h1>Cargos e Departamentos</h1>
      <p>Administrador: {user?.nome} • Estrutura organizacional</p>

      <section className="section-cargos">
        <h2>Cargos</h2>
        <div className="form-new">
          <input
            placeholder="Nome do cargo"
            value={novoCargo.nome}
            onChange={(e) =>
              setNovoCargo({ ...novoCargo, nome: e.target.value })
            }
          />
          <select
            value={novoCargo.nivel}
            onChange={(e) =>
              setNovoCargo({ ...novoCargo, nivel: e.target.value })
            }
          >
            <option>Júnior</option>
            <option>Pleno</option>
            <option>Sênior</option>
            <option>Especialista</option>
            <option>Gerente</option>
          </select>
          <select
            value={novoCargo.departamento_id}
            onChange={(e) =>
              setNovoCargo({ ...novoCargo, departamento_id: e.target.value })
            }
          >
            <option value="">Selecione departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
          <button onClick={handleAddCargo}>+ Adicionar Cargo</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nível</th>
              <th>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {cargos.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhum cargo cadastrado ainda.</td>
              </tr>
            ) : (
              cargos.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td>{c.nivel || "-"}</td>
                  <td>{c.departamento_nome}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="section-depts">
        <h2>Departamentos</h2>
        <div className="form-new">
          <input
            placeholder="Nome do departamento"
            value={novoDept.nome}
            onChange={(e) => setNovoDept({ ...novoDept, nome: e.target.value })}
          />
          <select
            value={novoDept.gerente_id}
            onChange={(e) =>
              setNovoDept({ ...novoDept, gerente_id: e.target.value })
            }
          >
            <option value="">Sem gerente (opcional)</option>
            {gerentesPossiveis.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome} ({g.role})
              </option>
            ))}
          </select>
          <button onClick={handleAddDepartamento}>
            + Adicionar Departamento
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Gerente</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.length === 0 ? (
              <tr>
                <td colSpan="2">Nenhum departamento cadastrado ainda.</td>
              </tr>
            ) : (
              departamentos.map((d) => (
                <tr key={d.id}>
                  <td>{d.nome}</td>
                  <td>{d.gerente_nome || "Sem gerente"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
