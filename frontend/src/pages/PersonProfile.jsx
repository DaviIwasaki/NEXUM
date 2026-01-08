// src/pages/PersonProfile.jsx (vou pedir para renomear o arquivo depois)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const mockHistoricoCandidaturas = [
  { id: 1, vaga: "Desenvolvedor Frontend", status: "Contratado", data: "07/01/2026" },
  { id: 2, vaga: "Analista de Dados", status: "Reprovado", data: "05/01/2026" },
];

const mockHistoricoContratual = [
  { data: "2026-03-01", evento: "Admissão", cargo: "Desenvolvedor Frontend Jr", salario: "R$ 6.000" },
  { data: "2026-09-01", evento: "Promoção", cargo: "Desenvolvedor Frontend Pleno", salario: "R$ 10.500" },
];

const mockDocumentos = [
  { nome: "Contrato de Trabalho", status: "Assinado" },
  { nome: "Exame Admissional", status: "Enviado" },
  { nome: "Carteira de Trabalho", status: "Digitalizada" },
];

export default function PersonProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [person, setPerson] = useState(null);
  const [editing, setEditing] = useState(false);

  // Determina se é o próprio perfil ou de outra pessoa
  const isOwnProfile = user && (!id || parseInt(id) === user.id);
  const viewingId = id ? parseInt(id) : user?.id;

  const canEdit = user && (
    user.role === "RH" || 
    user.role === "Admin" || 
    (isOwnProfile && user.role === "Colaborador")
  );

  useEffect(() => {
    // Mock unificado: mesma pessoa pode ter dados de candidato + colaborador
    const basePerson = {
      id: viewingId || user?.id || 501,
      nome: user?.nome || "João Silva",
      email: user?.email || "joao@empresa.com",
      telefone: "(31) 98765-4321",
      cpf: "123.456.789-00",
      pretensaoSalarial: user?.role === "Candidato" ? "R$ 8.000,00" : null,
      cargo: user?.cargo || "Desenvolvedor Frontend Pleno",
      departamento: user?.departamento || "TI",
      salarioAtual: user?.role === "Colaborador" ? "R$ 10.500,00" : null,
      admissao: user?.role === "Colaborador" ? "2026-03-01" : null,
      status: user?.role === "Colaborador" ? "Ativo" : "Candidato",
    };
    setPerson(basePerson);
  }, [viewingId, user]);

  if (!person) return <div>Carregando perfil...</div>;

  const isCandidate = user?.role === "Candidato" || person.status === "Candidato";
  const isEmployee = user?.role === "Colaborador" || person.status === "Ativo";

  return (
    <main className="person-profile-container">
      <button onClick={() => navigate(-1)}>← Voltar</button>

      <div className="profile-header">
        <h1>{person.nome}</h1>
        <span className={`status-badge ${person.status?.toLowerCase() || 'candidato'}`}>
          {isEmployee ? "Colaborador Ativo" : "Candidato"}
        </span>
        {canEdit && (
          <button onClick={() => setEditing(!editing)}>
            {editing ? "Cancelar" : "Editar Dados"}
          </button>
        )}
      </div>

      <Tabs>
        <TabList>
          <Tab>Dados Pessoais</Tab>
          {isCandidate && <Tab>Candidatura</Tab>}
          {isEmployee && <Tab>Dados Contratuais</Tab>}
          {isEmployee && <Tab>Documentos</Tab>}
          <Tab>Histórico</Tab>
        </TabList>

        <TabPanel>
          <div className="form-grid">
            <div><label>Nome</label><input value={person.nome} disabled={!editing} /></div>
            <div><label>Email</label><input value={person.email} disabled={!editing} /></div>
            <div><label>Telefone</label><input value={person.telefone} disabled={!editing} /></div>
            <div><label>CPF</label><input value={person.cpf} disabled /></div>
            {isCandidate && (
              <div><label>Pretensão Salarial</label><input value={person.pretensaoSalarial || "Não informada"} disabled={!editing} /></div>
            )}
          </div>
        </TabPanel>

        {isCandidate && (
          <TabPanel>
            <h3>Upload de Currículo</h3>
            <input type="file" accept=".pdf" disabled={!editing} />
            <p>Último currículo enviado: curriculum_joao.pdf</p>

            <h3>Histórico de Candidaturas</h3>
            <table>
              <thead><tr><th>Vaga</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                {mockHistoricoCandidaturas.map(c => (
                  <tr key={c.id}><td>{c.vaga}</td><td>{c.status}</td><td>{c.data}</td></tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
        )}

        {isEmployee && (
          <>
            <TabPanel>
              <div className="form-grid">
                <div><label>Cargo Atual</label><input value={person.cargo} disabled={!editing} /></div>
                <div><label>Departamento</label><input value={person.departamento} disabled={!editing} /></div>
                <div><label>Salário Atual</label><input value={person.salarioAtual} disabled /></div>
                <div><label>Data de Admissão</label><input value={person.admissao} disabled /></div>
              </div>
            </TabPanel>

            <TabPanel>
              <table>
                <thead><tr><th>Documento</th><th>Status</th><th>Ação</th></tr></thead>
                <tbody>
                  {mockDocumentos.map(doc => (
                    <tr key={doc.nome}>
                      <td>{doc.nome}</td>
                      <td>{doc.status}</td>
                      <td>{doc.status !== "Assinado" && canEdit && <button>Upload</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </>
        )}

        <TabPanel>
          <div className="timeline">
            {(isEmployee ? mockHistoricoContratual : mockHistoricoCandidaturas).map((evento, idx) => (
              <div key={idx} className="timeline-item">
                <strong>{evento.data}</strong> - {isEmployee ? evento.evento : evento.status}
                <p>{isEmployee ? `${evento.cargo} • ${evento.salario}` : evento.vaga}</p>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>

      {editing && (
        <button onClick={() => { alert("Alterações salvas!"); setEditing(false); }}>
          Salvar Alterações
        </button>
      )}
    </main>
  );
}