// src/pages/config/PositionsDepts.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/config/positionsDepts.css";

const mockCargos = [
  { id: 1, nome: "Desenvolvedor Frontend", nivel: "Pleno", departamento: "TI" },
  { id: 2, nome: "Analista de RH", nivel: "Pleno", departamento: "Recursos Humanos" },
  { id: 3, nome: "Product Manager", nivel: "Sênior", departamento: "Produto" },
  { id: 4, nome: "Designer UX/UI", nivel: "Júnior", departamento: "Design" },
];

const mockDepartamentos = [
  { id: 1, nome: "TI", gerente: "Carlos Lima" },
  { id: 2, nome: "Recursos Humanos", gerente: "Ana Souza" },
  { id: 3, nome: "Produto", gerente: "Pedro Santos" },
  { id: 4, nome: "Design", gerente: "Maria Oliveira" },
];

export default function PositionsDepts() {
  const { user } = useAuth();
  const [cargos, setCargos] = useState(mockCargos);
  const [departamentos, setDepartamentos] = useState(mockDepartamentos);
  const [novoCargo, setNovoCargo] = useState({ nome: "", nivel: "Júnior", departamento: "TI" });
  const [novoDept, setNovoDept] = useState({ nome: "", gerente: "" });

  const handleAddCargo = () => {
    if (!novoCargo.nome.trim()) {
      toast.error("Nome do cargo obrigatório");
      return;
    }

    const cargoNovo = {
      id: cargos.length + 1,
      ...novoCargo,
    };

    setCargos([...cargos, cargoNovo]);
    toast.success(`Cargo "${cargoNovo.nome}" cadastrado!`);
    setNovoCargo({ nome: "", nivel: "Júnior", departamento: "TI" });
  };

  const handleAddDepartamento = () => {
    if (!novoDept.nome.trim()) {
      toast.error("Nome do departamento obrigatório");
      return;
    }

    const deptNovo = {
      id: departamentos.length + 1,
      ...novoDept,
    };

    setDepartamentos([...departamentos, deptNovo]);
    toast.success(`Departamento "${deptNovo.nome}" cadastrado!`);
    setNovoDept({ nome: "", gerente: "" });
  };

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
            onChange={(e) => setNovoCargo({ ...novoCargo, nome: e.target.value })}
          />
          <select
            value={novoCargo.nivel}
            onChange={(e) => setNovoCargo({ ...novoCargo, nivel: e.target.value })}
          >
            <option>Júnior</option>
            <option>Pleno</option>
            <option>Sênior</option>
            <option>Especialista</option>
            <option>Gerente</option>
          </select>
          <select
            value={novoCargo.departamento}
            onChange={(e) => setNovoCargo({ ...novoCargo, departamento: e.target.value })}
          >
            {departamentos.map(d => <option key={d.id}>{d.nome}</option>)}
          </select>
          <button onClick={handleAddCargo}>+ Adicionar Cargo</button>
        </div>

        <table>
          <thead>
            <tr><th>Nome</th><th>Nível</th><th>Departamento</th></tr>
          </thead>
          <tbody>
            {cargos.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.nivel}</td>
                <td>{c.departamento}</td>
              </tr>
            ))}
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
          <input
            placeholder="Gerente responsável"
            value={novoDept.gerente}
            onChange={(e) => setNovoDept({ ...novoDept, gerente: e.target.value })}
          />
          <button onClick={handleAddDepartamento}>+ Adicionar Departamento</button>
        </div>

        <table>
          <thead>
            <tr><th>Nome</th><th>Gerente</th></tr>
          </thead>
          <tbody>
            {departamentos.map(d => (
              <tr key={d.id}>
                <td>{d.nome}</td>
                <td>{d.gerente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}