// src/pages/PersonProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";

import DismissalModal from "../components/modals/DismissalModal";
import "../styles/pages/personProfile.css";

/* ===================== MOCKS ===================== */

const mockAtividadesCandidato = [
  {
    data: "09/01/2026 14:30",
    titulo: "Nova vaga compatível com seu perfil",
    descricao:
      "A vaga 'Desenvolvedor React Sênior' na TechNova foi aberta e seu currículo se encaixa bem. Quer se candidatar?",
    acao: "Ver Vaga",
  },
  {
    data: "08/01/2026 10:15",
    titulo: "Solicitação de documento pendente",
    descricao:
      "Precisamos do seu comprovante de residência atualizado para prosseguir com sua candidatura. Prazo: 5 dias.",
    acao: "Enviar Documento",
  },
  {
    data: "07/01/2026 18:00",
    titulo: "Sua candidatura avançou",
    descricao:
      "Parabéns! Você passou para a etapa de Teste Técnico na vaga Desenvolvedor Frontend. Aguarde contato em até 48h.",
  },
  {
    data: "05/01/2026 09:45",
    titulo: "Feedback recebido",
    descricao:
      "Você recebeu feedback da etapa de Triagem. Confira os detalhes na aba Candidatura.",
  },
  {
    data: "03/01/2026 15:20",
    titulo: "Cadastro atualizado",
    descricao:
      "Seu telefone e e-mail foram confirmados com sucesso. Agora você pode receber notificações por WhatsApp.",
  },
];

const mockHistoricoCandidaturas = [
  {
    id: 1,
    vaga: "Desenvolvedor Frontend Pleno",
    status: "Contratado",
    data: "07/01/2026",
    empresa: "Tech Solutions Ltda",
    etapaFinal: "Entrevista Final",
    notaMedia: "8.7/10",
    feedbackResumo: "Excelente fit técnico e cultural. Bem-vindo ao time!",
  },
  {
    id: 2,
    vaga: "Analista de Dados Sênior",
    status: "Não avançou para próxima etapa",
    data: "05/01/2026",
    empresa: "DataCorp Brasil",
    etapaFinal: "Teste Técnico",
    notaMedia: "6.2/10",
    feedbackResumo:
      "Perfil sólido, mas experiência com BigQuery ainda em desenvolvimento. Sugerimos fortalecer essa stack.",
  },
  {
    id: 3,
    vaga: "UX Designer",
    status: "Processo em andamento",
    data: "03/01/2026",
    empresa: "DesignFlow",
    etapaFinal: "Entrevista RH",
    notaMedia: "-",
    feedbackResumo:
      "Aguardando feedback da equipe técnica. Boa apresentação inicial!",
  },
  {
    id: 4,
    vaga: "Desenvolvedor Fullstack Júnior",
    status: "Não avançou para próxima etapa",
    data: "15/12/2025",
    empresa: "Startup X",
    etapaFinal: "Triagem",
    notaMedia: "-",
    feedbackResumo:
      "Currículo bem estruturado, mas perfil mais alinhado com vagas sênior/pleno no momento.",
  },
];

const mockHistoricoCotidiano = [
  // NOVO: para coisas do dia a dia (Colaborador)
  {
    data: "2026-01-05",
    evento: "Atestado médico",
    motivo: "Consulta especializada",
    status: "Aprovado",
  },
  {
    data: "2026-01-03",
    evento: "Atraso",
    motivo: "Trânsito",
    status: "Justificado",
  },
  {
    data: "2025-12-28",
    evento: "Falta",
    motivo: "Problema familiar",
    status: "Aprovado",
  },
];

const mockHistoricoContratual = [
  {
    data: "2026-03-01",
    evento: "Admissão",
    cargo: "Desenvolvedor Frontend Jr",
    salario: "R$ 6.000",
  },
  {
    data: "2026-09-01",
    evento: "Promoção",
    cargo: "Desenvolvedor Frontend Pleno",
    salario: "R$ 10.500",
  },
  {
    data: "2027-03-01",
    evento: "Ajuste Salarial",
    cargo: "Desenvolvedor Frontend Pleno",
    salario: "R$ 12.000",
  },
];

const mockDocumentos = [
  { nome: "Contrato de Trabalho", status: "Assinado" },
  { nome: "Exame Admissional", status: "Enviado" },
  { nome: "Carteira de Trabalho", status: "Digitalizada" },
];

/* ===================== COMPONENT ===================== */

export default function PersonProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // Adicionamos updateUser para salvar edições

  const [person, setPerson] = useState(null);
  const [editing, setEditing] = useState(false);
  const [dismissalModalOpen, setDismissalModalOpen] = useState(false);

  /* ===================== PERMISSÕES ===================== */

  const isOwnProfile = user && (!id || Number(id) === user.id);
  const viewingId = id ? Number(id) : user?.id;

  const canEditPersonal = isOwnProfile || user?.role === "Admin"; // Só próprio ou Admin edita dados pessoais
  const canEditAdmin = user?.role === "RH" || user?.role === "Admin"; // RH/Admin edita campos administrativos

  /* ===================== LOAD MOCK ===================== */

  useEffect(() => {
    const basePerson = {
      id: viewingId || user?.id || 501,
      nome: user?.nome || "João Silva",
      email: user?.email || "joao@empresa.com",
      telefone: "(31) 98765-4321",
      cpf: "123.456.789-00",
      endereco: "Rua das Flores, 123 - Belo Horizonte/MG", // NOVO: Endereço
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

  const isCandidate =
    user?.role === "Candidato" || person.status === "Candidato";
  const isEmployee = user?.role === "Colaborador" || person.status === "Ativo";

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(person); // Atualiza no contexto (persiste no localStorage)
    toast.success("Alterações salvas com sucesso!");
    setEditing(false);
  };

  const handleDismissalConfirm = (data) => {
    setPerson((prev) => ({
      ...prev,
      status: "Desligado",
    }));
    toast.info(
      `Evento adicionado ao histórico: Demissão em ${data.dataDemissao}`
    );
  };

  /* ===================== RENDER ===================== */

  return (
    <main className="person-profile-container">
      <button onClick={() => navigate(-1)}>← Voltar</button>

      <div className="profile-header">
        <h1>{person.nome}</h1>
        <span
          className={`status-badge ${
            person.status?.toLowerCase() || "candidato"
          }`}
        >
          {isEmployee ? "Colaborador Ativo" : "Candidato"}
        </span>

        {canEditPersonal && (
          <button onClick={() => setEditing((v) => !v)}>
            {editing ? "Cancelar" : "Editar Dados"}
          </button>
        )}

        {(user?.role === "RH" || user?.role === "Admin") &&
          person.status === "Ativo" && (
            <button
              className="btn-danger"
              style={{ marginLeft: "10px" }}
              onClick={() => setDismissalModalOpen(true)}
            >
              Registrar Demissão
            </button>
          )}
      </div>

      <Tabs>
        <TabList>
          <Tab>Dados Pessoais</Tab>
          {isCandidate && <Tab>Candidatura</Tab>}
          {isEmployee && <Tab>Dados Contratuais</Tab>}
          {isEmployee && <Tab>Documentos</Tab>}
          <Tab>Histórico</Tab> {/* Cotidiano: faltas, atestados, etc. */}
          {isEmployee && <Tab>Histórico Contratual</Tab>}
          {isEmployee && <Tab>PDI</Tab>}
        </TabList>

        <TabPanel>
          <div className="form-grid">
            <div>
              <label>Nome Completo</label>
              <input
                name="nome"
                value={person.nome}
                disabled={true} // Sempre read-only
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                name="email"
                value={person.email}
                onChange={handleChange}
                disabled={!canEditPersonal || !editing}
              />
            </div>
            <div>
              <label>Telefone</label>
              <input
                name="telefone"
                value={person.telefone}
                onChange={handleChange}
                disabled={!canEditPersonal || !editing}
              />
            </div>
            <div>
              <label>Endereço Completo</label>
              <input
                name="endereco"
                value={person.endereco}
                disabled={true} // Sempre read-only
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />
              <small className="info-text">
                Para atualizar endereço, contate RH com comprovante (ex: conta
                de luz).
              </small>
            </div>
            <div>
              <label>CPF</label>
              <input value={person.cpf} disabled />
            </div>

            {isCandidate && (
              <div>
                <label>Pretensão Salarial</label>
                <input
                  name="pretensaoSalarial"
                  value={person.pretensaoSalarial || "Não informada"}
                  onChange={handleChange}
                  disabled={!canEditPersonal || !editing}
                />
              </div>
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
              <thead>
                <tr>
                  <th>Vaga</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {mockHistoricoCandidaturas.map((c) => (
                  <tr key={c.id}>
                    <td>{c.vaga}</td>
                    <td>{c.status}</td>
                    <td>{c.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Avaliações Recebidas</h3>
            {localStorage.getItem(`evaluation_${person.id}`) ? (
              (() => {
                const evalData = JSON.parse(
                  localStorage.getItem(`evaluation_${person.id}`)
                );
                return (
                  <div className="evaluation-item">
                    <p>
                      <strong>Data:</strong> {evalData.date}
                    </p>
                    <p>
                      <strong>Decisão:</strong>{" "}
                      {evalData.decision === "approved"
                        ? "Aprovado"
                        : "Reprovado"}
                    </p>
                    <p>
                      <strong>Nota:</strong> {evalData.score}/10
                    </p>
                    <p>
                      <strong>Feedback:</strong> {evalData.feedback}
                    </p>
                    <p>
                      <small>
                        Por: {evalData.evaluatedBy} ({evalData.role})
                      </small>
                    </p>
                  </div>
                );
              })()
            ) : (
              <p>Ainda não há avaliações para essa candidatura.</p>
            )}
          </TabPanel>
        )}

        {isCandidate && (
          <TabPanel>
            <h2>Histórico de Atividades</h2>
            <p>
              Aqui você acompanha notificações, atualizações e solicitações do
              sistema.
            </p>

            <div className="activity-timeline">
              {mockAtividadesCandidato.map((atividade, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-date">{atividade.data}</div>
                  <div className="activity-content">
                    <strong>{atividade.titulo}</strong>
                    <p>{atividade.descricao}</p>
                    {atividade.acao && (
                      <button
                        className="btn-small"
                        onClick={() => {
                          toast.info(`Ação simulada: ${atividade.acao}`);
                          // Aqui poderia navegar para upload de doc, perfil, etc.
                        }}
                      >
                        {atividade.acao}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {mockAtividadesCandidato.length === 0 && (
              <p className="empty-message">
                Nenhuma atividade recente. Fique de olho aqui!
              </p>
            )}
          </TabPanel>
        )}

        {isEmployee && (
          <>
            <TabPanel>
              <div className="form-grid">
                <div>
                  <label>Cargo Atual</label>
                  <input
                    value={person.cargo}
                    disabled={!canEditAdmin || !editing}
                  />
                </div>
                <div>
                  <label>Departamento</label>
                  <input
                    value={person.departamento}
                    disabled={!canEditAdmin || !editing}
                  />
                </div>
                <div>
                  <label>Salário Atual</label>
                  <input
                    value={person.salarioAtual}
                    disabled={!canEditAdmin || !editing}
                  />
                </div>
                <div>
                  <label>Data de Admissão</label>
                  <input value={person.admissao} disabled />
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
                        {doc.status !== "Assinado" && canEditAdmin && (
                          <button>Upload</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>

            <TabPanel>
              <h2>Histórico (Cotidiano)</h2>
              <div className="timeline">
                {mockHistoricoCotidiano.map((evento, idx) => (
                  <div key={idx} className="timeline-item">
                    <strong>{evento.data}</strong> — {evento.evento}
                    <p>Motivo: {evento.motivo}</p>
                    <p>Status: {evento.status}</p>
                  </div>
                ))}
              </div>
            </TabPanel>

            <TabPanel>
              <h2>Histórico Contratual</h2>
              <div className="contract-timeline">
                {mockHistoricoContratual.map((evento, idx) => (
                  <div key={idx} className="timeline-item">
                    <strong>{evento.data}</strong>
                    <h4>{evento.evento}</h4>
                    <p>Cargo: {evento.cargo}</p>
                    <p>Salário: {evento.salario}</p>
                    {evento.novoDept && (
                      <p>Novo Departamento: {evento.novoDept}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabPanel>

            <TabPanel>
              <h2>Meu PDI (Plano de Desenvolvimento Individual)</h2>
              <p>
                PDI gerado a partir da última avaliação. Clique abaixo para
                visualizar em tela cheia.
              </p>
              <button className="btn-primary" onClick={() => navigate("/pdi")}>
                Ver Meu PDI Completo
              </button>
            </TabPanel>
          </>
        )}
      </Tabs>

      {editing && (
        <button onClick={handleSave} className="btn-save">
          Salvar Alterações
        </button>
      )}

      {(user?.role === "RH" || user?.role === "Admin") && (
        <button
          onClick={() => navigate(`/colaboradores/${person.id}/alteracao`)}
          style={{ marginTop: "20px" }}
        >
          Alteração Contratual
        </button>
      )}

      <DismissalModal
        isOpen={dismissalModalOpen}
        onClose={() => setDismissalModalOpen(false)}
        colaborador={person}
        onConfirm={handleDismissalConfirm}
      />
    </main>
  );
}
