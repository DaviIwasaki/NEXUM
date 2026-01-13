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

// Componente principal
export default function PersonProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Estados principais
  const [person, setPerson] = useState(null);
  const [editing, setEditing] = useState(false);
  const [dismissalModalOpen, setDismissalModalOpen] = useState(false);

  // Estados por aba com loading e erro
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState(null);

  const [candidaturas, setCandidaturas] = useState([]);
  const [loadingCandidaturas, setLoadingCandidaturas] = useState(true);
  const [errorCandidaturas, setErrorCandidaturas] = useState(null);

  const [contract, setContract] = useState({});
  const [loadingContract, setLoadingContract] = useState(true);
  const [errorContract, setErrorContract] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [errorDocuments, setErrorDocuments] = useState(null);

  const [dailyHistory, setDailyHistory] = useState([]);
  const [loadingDailyHistory, setLoadingDailyHistory] = useState(true);
  const [errorDailyHistory, setErrorDailyHistory] = useState(null);

  const [contractHistory, setContractHistory] = useState([]);
  const [loadingContractHistory, setLoadingContractHistory] = useState(true);
  const [errorContractHistory, setErrorContractHistory] = useState(null);

  const [pdi, setPdi] = useState({
    descricao: "PDI não gerado ainda",
    data_geracao: "",
  });
  const [loadingPdi, setLoadingPdi] = useState(true);
  const [errorPdi, setErrorPdi] = useState(null);

  // Token e base da API
  const token = localStorage.getItem("nexum_token");
  const apiBase = "http://localhost:8000";

  // Função auxiliar para fetch com autenticação
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Erro ${response.status}`;
      console.error(
        `[FETCH ERROR] ${endpoint} - Status: ${response.status} - Detail: ${errorMessage}`
      );
      toast.error(errorMessage); // Mostra o erro real do backend
      throw new Error(errorMessage);
    }
    return response.json();
  };

  // ID do perfil que estamos visualizando
  const viewingId = id ? Number(id) : user?.id;
  const isOwnProfile = viewingId === user?.id;

  // Permissões
  const canEditPersonal = isOwnProfile || user?.role === "Admin";
  const canEditAdmin = user?.role === "RH" || user?.role === "Admin";

  // Determina se é candidato ou colaborador
  const isCandidate = person?.role === "Candidato";
  const isEmployee = person?.role === "Colaborador";

  // Carrega dados do perfil principal
  useEffect(() => {
    if (!viewingId) {
      toast.warn("ID de perfil não encontrado");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await fetchWithToken(`/users/${viewingId}`);
        setPerson(data);
      } catch (err) {
        console.error("[Perfil] Erro:", err);
        toast.error(err.message || "Falha ao carregar perfil");
        setPerson(null);
      }
    };

    fetchProfile();
  }, [viewingId]);

  // Carrega atividades (apenas para candidatos)
  useEffect(() => {
    if (!isCandidate || !viewingId) return;

    const fetchActivities = async () => {
      setLoadingActivities(true);
      setErrorActivities(null);
      try {
        const data = await fetchWithToken(`/users/${viewingId}/activities`);
        setActivities(data);
      } catch (err) {
        setErrorActivities(err.message);
        toast.error("Falha ao carregar atividades");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [viewingId, isCandidate]);

  // Carrega candidaturas (apenas para candidatos)
  useEffect(() => {
    if (!isCandidate || !viewingId) return;

    const fetchCandidaturas = async () => {
      setLoadingCandidaturas(true);
      setErrorCandidaturas(null);
      try {
        const data = await fetchWithToken(`/users/${viewingId}/candidatures`);
        setCandidaturas(data);
      } catch (err) {
        setErrorCandidaturas(err.message);
        toast.error("Falha ao carregar candidaturas");
      } finally {
        setLoadingCandidaturas(false);
      }
    };

    fetchCandidaturas();
  }, [viewingId, isCandidate]);

  // Carrega dados contratuais (apenas colaboradores)
  useEffect(() => {
    if (!isEmployee || !viewingId) return;

    const fetchContract = async () => {
      setLoadingContract(true);
      setErrorContract(null);
      try {
        const data = await fetchWithToken(`/users/${viewingId}/contract`);
        setContract(data);
      } catch (err) {
        setErrorContract(err.message);
        toast.error("Falha ao carregar dados contratuais");
      } finally {
        setLoadingContract(false);
      }
    };

    fetchContract();
  }, [viewingId, isEmployee]);

  // Carrega documentos
  useEffect(() => {
    if (!isEmployee || !viewingId) return;

    const fetchDocuments = async () => {
      setLoadingDocuments(true);
      setErrorDocuments(null);
      try {
        const data = await fetchWithToken(`/users/${viewingId}/documents`);
        setDocuments(data);
      } catch (err) {
        setErrorDocuments(err.message);
        toast.error("Falha ao carregar documentos");
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, [viewingId, isEmployee]);

  // Carrega histórico cotidiano
  useEffect(() => {
    if (!isEmployee || !viewingId) return;

    const fetchDailyHistory = async () => {
      setLoadingDailyHistory(true);
      setErrorDailyHistory(null);
      try {
        const data = await fetchWithToken(`/users/${viewingId}/daily-history`);
        setDailyHistory(data);
      } catch (err) {
        setErrorDailyHistory(err.message);
        toast.error("Falha ao carregar histórico cotidiano");
      } finally {
        setLoadingDailyHistory(false);
      }
    };

    fetchDailyHistory();
  }, [viewingId, isEmployee]);

  // Carrega histórico contratual
  useEffect(() => {
    if (!isEmployee || !viewingId) return;

    const fetchContractHistory = async () => {
      setLoadingContractHistory(true);
      setErrorContractHistory(null);
      try {
        const data = await fetchWithToken(
          `/users/${viewingId}/contract-history`
        );
        setContractHistory(data);
      } catch (err) {
        setErrorContractHistory(err.message);
        toast.error("Falha ao carregar histórico contratual");
      } finally {
        setLoadingContractHistory(false);
      }
    };

    fetchContractHistory();
  }, [viewingId, isEmployee]);

  // Carrega PDI
  useEffect(() => {
    if (!isEmployee || !viewingId) return;

    const fetchPdi = async () => {
      setLoadingPdi(true);
      setErrorPdi(null);
      try {
        const data = await fetchWithToken(`/users/${viewingId}/pdi`);
        setPdi(data);
      } catch (err) {
        setErrorPdi(err.message);
        toast.error("Falha ao carregar PDI");
      } finally {
        setLoadingPdi(false);
      }
    };

    fetchPdi();
  }, [viewingId, isEmployee]);

  // Salvar alterações de perfil (apenas campos editáveis)
  const handleSave = async () => {
    if (!person) return;

    // Campos que podem ser editados (telefone, pretensão salarial, etc.)
    const updateData = {
      telefone: person.telefone,
      pretensao_salarial: person.pretensao_salarial,
      // Adicione outros campos editáveis aqui
    };

    try {
      const response = await fetch(`${apiBase}/users/${viewingId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao salvar perfil");
      }

      toast.success("Perfil atualizado com sucesso");
      setEditing(false);
      // Atualiza o user no contexto se for o próprio perfil
      if (isOwnProfile) {
        updateUser({ ...user, ...updateData });
      }
    } catch (err) {
      toast.error(err.message || "Falha ao salvar alterações");
    }
  };

  // Callback do modal de demissão
  const handleDismissalConfirm = async (motivo) => {
    try {
      const response = await fetch(`${apiBase}/users/${viewingId}/dismiss`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motivo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao demitir colaborador");
      }

      toast.success("Colaborador demitido com sucesso");
      setDismissalModalOpen(false);
      // Atualiza o perfil para refletir a demissão
      setPerson({ ...person, is_active: false });
    } catch (err) {
      toast.error(err.message || "Falha ao realizar demissão");
    }
  };

  // Loading geral
  if (!person) {
    return <div className="loading">Carregando perfil...</div>;
  }

  return (
    <main className="person-profile-container">
      <header className="profile-header">
        <h1>{person.nome}</h1>
        <span className={`role-badge ${person.role?.toLowerCase()}`}>
          {person.role || "Candidato"}
        </span>
        {person.is_active === false && (
          <span className="status-badge inactive">Inativo (Demitido)</span>
        )}
      </header>

      <Tabs>
        <TabList>
          {isCandidate && <Tab>Atividades</Tab>}
          {isCandidate && <Tab>Candidaturas</Tab>}
          <Tab>Dados Pessoais</Tab>
          {isEmployee && <Tab>Dados Contratuais</Tab>}
          {isEmployee && <Tab>Documentos</Tab>}
          {isEmployee && <Tab>Histórico Cotidiano</Tab>}
          {isEmployee && <Tab>Histórico Contratual</Tab>}
          {isEmployee && <Tab>PDI</Tab>}
        </TabList>

        {/* Aba Atividades */}
        {isCandidate && (
          <TabPanel>
            {loadingActivities ? (
              <p>Carregando atividades...</p>
            ) : errorActivities ? (
              <p className="error">Erro: {errorActivities}</p>
            ) : activities.length > 0 ? (
              <div className="timeline">
                {activities.map((act) => (
                  <div key={act.data} className="timeline-item">
                    <strong>{act.data}</strong> — {act.titulo}
                    <p>{act.descricao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma atividade registrada.</p>
            )}
          </TabPanel>
        )}

        {/* Aba Candidaturas */}
        {isCandidate && (
          <TabPanel>
            {loadingCandidaturas ? (
              <p>Carregando candidaturas...</p>
            ) : errorCandidaturas ? (
              <p className="error">Erro: {errorCandidaturas}</p>
            ) : candidaturas.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Vaga</th>
                    <th>Empresa</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Etapa Final</th>
                    <th>Nota Média</th>
                  </tr>
                </thead>
                <tbody>
                  {candidaturas.map((cand) => (
                    <tr key={cand.id}>
                      <td>{cand.vaga}</td>
                      <td>{cand.empresa}</td>
                      <td>{cand.status}</td>
                      <td>{cand.data}</td>
                      <td>{cand.etapa_final}</td>
                      <td>{cand.nota_media || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma candidatura registrada.</p>
            )}
          </TabPanel>
        )}

        {/* Aba Dados Pessoais */}
        <TabPanel>
          <div className="form-grid">
            <div>
              <label>Nome</label>
              <input value={person.nome} disabled />
            </div>
            <div>
              <label>E-mail</label>
              <input value={person.email} disabled />
            </div>
            <div>
              <label>CPF</label>
              <input value={person.cpf} disabled />
            </div>
            <div>
              <label>Telefone</label>
              <input
                value={person.telefone || ""}
                disabled={!editing || !canEditPersonal}
                onChange={(e) =>
                  setPerson({ ...person, telefone: e.target.value })
                }
              />
            </div>
            <div>
              <label>Endereço</label>
              <input value={person.endereco || ""} disabled />
            </div>
            <div>
              <label>Pretensão Salarial</label>
              <input
                value={person.pretensao_salarial || ""}
                disabled={!editing || !canEditPersonal}
                onChange={(e) =>
                  setPerson({ ...person, pretensao_salarial: e.target.value })
                }
              />
            </div>
          </div>

          {canEditPersonal && (
            <div className="actions">
              <button
                className="btn-primary"
                onClick={() => setEditing(!editing)}
              >
                {editing ? "Cancelar Edição" : "Editar Perfil"}
              </button>
              {editing && (
                <button className="btn-save" onClick={handleSave}>
                  Salvar Alterações
                </button>
              )}
            </div>
          )}
        </TabPanel>

        {/* Aba Dados Contratuais */}
        {isEmployee && (
          <TabPanel>
            {loadingContract ? (
              <p>Carregando dados contratuais...</p>
            ) : errorContract ? (
              <p className="error">Erro: {errorContract}</p>
            ) : (
              <div className="form-grid">
                <div>
                  <label>Cargo Atual</label>
                  <input value={contract.cargo || ""} disabled />
                </div>
                <div>
                  <label>Departamento</label>
                  <input value={contract.departamento || ""} disabled />
                </div>
                <div>
                  <label>Salário Atual</label>
                  <input value={contract.salario_atual || ""} disabled />
                </div>
                <div>
                  <label>Data de Admissão</label>
                  <input value={contract.admissao || ""} disabled />
                </div>
              </div>
            )}
          </TabPanel>
        )}

        {/* Aba Documentos */}
        {isEmployee && (
          <TabPanel>
            {loadingDocuments ? (
              <p>Carregando documentos...</p>
            ) : errorDocuments ? (
              <p className="error">Erro: {errorDocuments}</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <tr key={doc.nome}>
                        <td>{doc.nome}</td>
                        <td>{doc.status}</td>
                        <td>
                          {doc.status !== "Assinado" && canEditAdmin && (
                            <button>Upload</button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">Nenhum documento registrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </TabPanel>
        )}

        {/* Aba Histórico Cotidiano */}
        {isEmployee && (
          <TabPanel>
            {loadingDailyHistory ? (
              <p>Carregando histórico cotidiano...</p>
            ) : errorDailyHistory ? (
              <p className="error">Erro: {errorDailyHistory}</p>
            ) : dailyHistory.length > 0 ? (
              <div className="timeline">
                {dailyHistory.map((evento, idx) => (
                  <div key={idx} className="timeline-item">
                    <strong>{evento.data}</strong> — {evento.evento}
                    <p>Motivo: {evento.motivo}</p>
                    <p>Status: {evento.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhum evento no histórico cotidiano.</p>
            )}
          </TabPanel>
        )}

        {/* Aba Histórico Contratual */}
        {isEmployee && (
          <TabPanel>
            {loadingContractHistory ? (
              <p>Carregando histórico contratual...</p>
            ) : errorContractHistory ? (
              <p className="error">Erro: {errorContractHistory}</p>
            ) : contractHistory.length > 0 ? (
              <div className="contract-timeline">
                {contractHistory.map((evento, idx) => (
                  <div key={idx} className="timeline-item">
                    <strong>{evento.data}</strong>
                    <h4>{evento.evento}</h4>
                    <p>Cargo: {evento.cargo}</p>
                    <p>Salário: {evento.salario}</p>
                    {evento.novo_dept && (
                      <p>Novo Departamento: {evento.novo_dept}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhum evento no histórico contratual.</p>
            )}
          </TabPanel>
        )}

        {/* Aba PDI */}
        {isEmployee && (
          <TabPanel>
            {loadingPdi ? (
              <p>Carregando PDI...</p>
            ) : errorPdi ? (
              <p className="error">Erro: {errorPdi}</p>
            ) : (
              <>
                <h2>Meu PDI (Plano de Desenvolvimento Individual)</h2>
                <p>{pdi.descricao}</p>
                <p>
                  <small>Gerado em: {pdi.data_geracao}</small>
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/pdi")}
                >
                  Ver Meu PDI Completo
                </button>
              </>
            )}
          </TabPanel>
        )}
      </Tabs>

      {/* Ações administrativas */}
      {canEditAdmin && (
        <div className="admin-actions" style={{ marginTop: "2rem" }}>
          <button
            className="btn-warning"
            onClick={() => setDismissalModalOpen(true)}
          >
            Demitir Colaborador
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(`/colaboradores/${viewingId}/alteracao`)}
          >
            Alteração Contratual
          </button>
        </div>
      )}

      {/* Modal de demissão */}
      <DismissalModal
        isOpen={dismissalModalOpen}
        onClose={() => setDismissalModalOpen(false)}
        colaborador={person}
        onConfirm={handleDismissalConfirm}
      />
    </main>
  );
}
