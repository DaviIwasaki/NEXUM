// src/pages/employees/EmployeeProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // npm i react-tabs se não tiver

const mockHistorico = [
  { data: "2025-03-01", evento: "Admissão", cargo: "Desenvolvedor Frontend", salario: "R$ 8.000" },
  { data: "2025-09-01", evento: "Promoção", cargo: "Desenvolvedor Frontend Pleno", salario: "R$ 10.500" },
];

const mockDocumentos = [
  { nome: "RG", status: "Enviado" },
  { nome: "CPF", status: "Enviado" },
  { nome: "Contrato de Trabalho", status: "Pendente" },
  { nome: "Atestado Médico", status: "Não enviado" },
];

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [colaborador, setColaborador] = useState(null);
  const [editing, setEditing] = useState(false);

  const isOwnProfile = user?.role === "Colaborador" && parseInt(id) === user.id;
  const canEdit = (user?.role === "RH" || user?.role === "Admin") || isOwnProfile;

  useEffect(() => {
    // Mock fetch colaborador
    const mock = {
      id: parseInt(id),
      nome: "João Silva",
      email: "joao@empresa.com",
      telefone: "(31) 98765-4321",
      cpf: "123.456.789-00",
      cargo: "Desenvolvedor Frontend Pleno",
      departamento: "TI",
      salario: "R$ 10.500,00",
      admissao: "2025-03-01",
      status: "Ativo",
    };
    setColaborador(mock);
  }, [id]);

  if (!colaborador) return <div>Carregando perfil...</div>;

  const handleSave = () => {
    // Futuro PATCH /colaboradores/{id}
    alert("Dados salvos com sucesso!");
    setEditing(false);
  };

  return (
    <main className="employee-profile-container">
      <button onClick={() => navigate(-1)}>← Voltar</button>

      <div className="profile-header">
        <h1>{colaborador.nome}</h1>
        <span className={`status-badge ${colaborador.status.toLowerCase()}`}>
          {colaborador.status}
        </span>
        {canEdit && (
          <button onClick={() => setEditing(!editing)}>
            {editing ? "Cancelar" : "Editar"}
          </button>
        )}
      </div>

      <Tabs>
        <TabList>
          <Tab>Dados Pessoais</Tab>
          <Tab>Dados Contratuais</Tab>
          <Tab>Documentos</Tab>
          <Tab>Histórico</Tab>
        </TabList>

        <TabPanel>
          <div className="form-grid">
            <div>
              <label>Nome</label>
              <input value={colaborador.nome} disabled={!editing} />
            </div>
            <div>
              <label>Email</label>
              <input value={colaborador.email} disabled={!editing} />
            </div>
            <div>
              <label>Telefone</label>
              <input value={colaborador.telefone} disabled={!editing} />
            </div>
            <div>
              <label>CPF</label>
              <input value={colaborador.cpf} disabled />
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="form-grid">
            <div>
              <label>Cargo Atual</label>
              <input value={colaborador.cargo} disabled={!editing} />
            </div>
            <div>
              <label>Departamento</label>
              <input value={colaborador.departamento} disabled={!editing} />
            </div>
            <div>
              <label>Salário Atual</label>
              <input value={colaborador.salario} disabled={!editing} />
            </div>
            <div>
              <label>Data de Admissão</label>
              <input value={colaborador.admissao} disabled />
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <table>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {mockDocumentos.map((doc) => (
                <tr key={doc.nome}>
                  <td>{doc.nome}</td>
                  <td>{doc.status}</td>
                  <td>
                    {doc.status === "Não enviado" && canEdit && (
                      <button>Upload</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <div className="timeline">
            {mockHistorico.map((evento, idx) => (
              <div key={idx} className="timeline-item">
                <strong>{evento.data}</strong> - {evento.evento}
                <p>{evento.cargo} • {evento.salario}</p>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>

      {editing && (
        <button onClick={handleSave} className="btn-save">
          Salvar Alterações
        </button>
      )}
    </main>
  );
}