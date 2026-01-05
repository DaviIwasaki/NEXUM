# Especificações.md — NEXUM  
## Sistema de Gestão de Recrutamento e Recursos Humanos

---

## Introdução ao Documento

Este documento unifica as **Especificações Técnicas** (Arquitetura e Tecnologias) e o **Levantamento de Requisitos** (Funcionais, Não Funcionais e Restrições) do projeto **NEXUM**.

Optou-se tecnicamente por apresentar primeiro a seção de **Arquitetura e Tecnologias**, pois isso fornece um contexto claro sobre **como** o sistema será implementado antes de detalhar **o que** ele deve fazer. Essa ordem facilita a compreensão para desenvolvedores iniciantes, permitindo visualizar a pilha tecnológica antes de mapear os requisitos a ela.

Além disso, na prática brasileira (em empresas como startups de HR Tech ou consultorias como a CI&T), documentos dessa natureza são comuns para alinhar times multidisciplinares.

O foco do projeto está na **lógica prática**: prioriza-se um **MVP (Minimum Viable Product)** escalável, seguro (considerando a **LGPD**) e alinhado a processos reais de RH no Brasil (ex.: conformidade com **CLT** para contratações, suporte a diversidade e inclusão).

O documento é conciso (2–4 páginas quando renderizado), porém abrangente o suficiente para guiar o desenvolvimento sem sobrecarregar.

- **Última atualização:** 05 de janeiro de 2026  
- **Autor do projeto:** Davi Iwasaki Silva
- **Versão:** 1.0  

---

## Especificações Técnicas (Arquitetura e Tecnologias)

### Visão Geral da Arquitetura

O **NEXUM** segue uma arquitetura **cliente-servidor moderna**, com separação clara entre **frontend**, **backend** e **banco de dados**. Essa abordagem garante **manutenibilidade**, **escalabilidade** e **segurança**.

A comunicação ocorre por meio de uma **API RESTful**, permitindo futuras expansões, como integrações com **eSocial** ou ferramentas de folha de pagamento (ex.: **TOTVS**).

#### Diagrama de Arquitetura (representação textual)

[ Frontend - React ] <--> [ API REST - FastAPI ] <--> [ Banco de Dados - PostgreSQL ]


- **Autenticação:** JWT + RBAC (verificação de papéis em cada requisição)
- **Infraestrutura:** Docker (containers para ambiente local e cloud)
- **Comunicação:** HTTPS com CORS configurado para frontend local

**Explicação:**  
O frontend realiza chamadas HTTP para a API, que valida autenticação e acessa o banco de dados. Isso evita a exposição direta de dados sensíveis, o que é essencial para conformidade com a **LGPD**.

---

### Tecnologias e Ferramentas

#### Backend
- **FastAPI (Python)**  
  Escolhido por ser rápido, assíncrono e oferecer documentação automática via Swagger UI.  
  *Alternativa:* Flask, caso se deseje simplicidade inicial.

**Estrutura em camadas:**
- **Domain:** Modelos de domínio (ex.: `Vaga`, `Candidato`) e regras de negócio
- **Application:** Serviços e casos de uso (ex.: criação de processo seletivo)
- **Infrastructure:** Repositórios, persistência e integrações externas
- **API:** Endpoints REST (`/vagas`, `/candidatos/aplicar`)

---

#### Frontend
- **React (JavaScript)**  
  Setup com `create-react-app`, priorizando componentização.

**Bibliotecas:**
- React Router (navegação)
- Axios (requisições HTTP)
- Formik + Yup (formulários e validação)
- Bootstrap ou Material UI (UI responsiva)

---

#### Banco de Dados
- **PostgreSQL**  
  Banco relacional para garantir integridade de dados (chaves estrangeiras e constraints).

- **Migrations:** Alembic  
- **Motivo:** Gratuito, robusto e amplamente utilizado no mercado brasileiro.

---

#### Autenticação e Segurança
- JWT (JSON Web Tokens) com refresh tokens
- RBAC (Role-Based Access Control) via decorators no backend  
  Exemplo: `@role_required('RH')`
- Senhas criptografadas com **bcrypt**

**Conformidade LGPD:**
- Consentimento explícito no cadastro de candidatos
- Opção de exclusão definitiva de dados pessoais

---

### Estrutura de Pastas / Modularização

#### Backend (`backend/`)

app/
├─ domain/
├─ application/
├─ infrastructure/
api/
├─ routers/
config/
├─ settings.py
migrations/

#### Frontend (`frontend/`)

src/
├─ components/
├─ pages/
├─ services/
├─ store/


#### Raiz do Projeto
- `docker-compose.yml` para execução local completa

---

### Dependências e Bibliotecas

**Backend:**
- FastAPI
- SQLAlchemy (ORM)
- Pydantic (validação)
- PyJWT
- PyPDF2 (parsing de currículos)
- Alembic (migrations)

**Frontend:**
- React
- React DOM
- Axios
- Formik
- Yup
- Bootstrap ou Material UI

**Outras:**
- Docker
- Git (versionamento)
- Python 3.10+
- Node.js 18+

---

### Deploy e Ambiente

- **Local:** Docker Compose
- **Futuro:**
  - Frontend: Vercel
  - Backend/Banco: Railway ou Heroku
- Testes obrigatórios em ambiente de desenvolvimento antes de produção

Essa pilha tecnológica é prática para o contexto brasileiro: **open-source**, baixo custo e alinhada às exigências do mercado (empresas como Nubank, iFood, etc.).

---

## Levantamento de Requisitos

### Requisitos Funcionais (RF)

Os requisitos funcionais descrevem **o que o sistema deve fazer**. Estão numerados para rastreabilidade.

- **RF01 – Autenticação e Controle de Acesso**  
  Login por e-mail e senha. Papéis:
  - Admin
  - RH
  - Gestor
  - Candidato  
  Controle via RBAC.

- **RF02 – Cadastro de Entidades**  
  Cadastro de:
  - Empresa (CNPJ, nome, endereço)
  - Usuário (e-mail, senha, papel)
  - Pessoa/Candidato (CPF, nome, contato, dados pessoais com consentimento LGPD)
  - Vaga (título, descrição, requisitos, salário pretendido)

- **RF03 – Upload e Processamento de Currículo**  
  Upload de currículo em PDF com parsing básico para extração de texto.

- **RF04 – Aplicação a Vagas**  
  Candidato visualiza vagas abertas e aplica. O sistema impede aplicações duplicadas ativas na mesma empresa.

- **RF05 – Gerenciamento de Processos Seletivos**  
  RH define etapas ordenadas (Triagem, Entrevista, Aprovação).  
  Gestores avaliam candidatos em etapas técnicas.

- **RF06 – Acompanhamento e Notificações**  
  Status em tempo real para candidatos.  
  Dashboard para RH e gestores.  
  Registro de histórico de ações (audit log).

- **RF07 – Encerramento e Contratação**  
  Vaga só pode ser encerrada com contratação ou cancelamento explícito.  
  Registro básico de contratação (data e cargo – alinhado à CLT).

---

### Requisitos Não Funcionais (RNF)

- **RNF01 – Segurança**  
  Senhas com bcrypt, JWT com expiração (1h) e refresh (24h).  
  Criptografia de dados sensíveis (ex.: CPF).  
  Logs de acesso.

- **RNF02 – Performance**  
  Tempo de resposta inferior a 2 segundos.  
  Uso de índices no banco de dados.

- **RNF03 – Escalabilidade**  
  Suporte inicial a até 1.000 usuários por empresa.  
  Arquitetura preparada para escalabilidade horizontal.

- **RNF04 – Usabilidade**  
  Interface responsiva e intuitiva.  
  Idioma: português-BR.  
  Validações de formulário (ex.: CPF válido).  
  Acessibilidade (contraste, textos alternativos).

- **RNF05 – Manutenibilidade**  
  Código modular, testável e documentado.  
  Cobertura mínima de testes unitários: 70%.

---

### Restrições / Limitações

- **REST01 – Formato de Arquivo:** Apenas PDF para currículos
- **REST02 – Plataforma:** Sistema web (sem app mobile nativo)
- **REST03 – Banco de Dados:** Exclusivamente PostgreSQL
- **REST04 – Integrações:** Sem IA avançada ou integrações externas no MVP
- **REST05 – Idioma:** Apenas português-BR

---

### Priorização para o MVP

Os requisitos iniciais priorizados são:
- **RF01 a RF04**  
  (autenticação, cadastros e aplicação a vagas)

Esses requisitos formam a base sólida do sistema para evolução futura.
