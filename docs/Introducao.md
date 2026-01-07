# NEXUM — Sistema de Gestão de Recrutamento e Recursos Humanos

## Visão Geral do Projeto

### Problema que o sistema resolve

No Brasil, empresas de médio porte (de 50 a 500 colaboradores) enfrentam desafios constantes no processo de recrutamento e seleção:

- Alto volume de candidaturas por vaga (média de 100 a 300 currículos por oportunidade em muitas regiões).
- Dificuldade em organizar e acompanhar processos seletivos de forma estruturada e transparente.
- Dependência de soluções comerciais (como Gupy, Kenoby ou Vagas.com) que são caras, pouco flexíveis e nem sempre se adequam ao fluxo interno da empresa.
- Risco de não conformidade com a LGPD ao armazenar dados sensíveis de candidatos de forma inadequada.
- Falta de integração com sistemas internos (folha de pagamento, eSocial, controles de diversidade e inclusão).

Esses problemas geram perda de tempo da equipe de RH, risco de perder bons candidatos e custos elevados com ferramentas externas.

### Público-alvo

- Empresas brasileiras de médio porte que desejam um sistema interno personalizado de gestão de pessoas e recrutamento.
- Equipes de Recursos Humanos e gestores que precisam de controle total sobre os processos seletivos.
- Candidatos que buscam uma experiência clara e profissional ao se candidatar.

### Objetivos gerais

Desenvolver um sistema web corporativo (ATS + núcleo de RH) que permita à empresa gerenciar todo o ciclo de recrutamento e gestão básica de colaboradores de forma eficiente, segura e customizável.

### Objetivos específicos

- Permitir o cadastro e gerenciamento de vagas, candidatos e processos seletivos com etapas definidas.
- Garantir controle de acesso por papéis (RBAC): Administrador, RH, Gestor e Candidato.
- Oferecer acompanhamento em tempo real do status das candidaturas para todos os envolvidos.
- Armazenar e processar currículos de forma segura, com conformidade básica à LGPD (consentimento explícito e criptografia de dados sensíveis).
- Fornecer dashboards simples para visualização de indicadores (vagas abertas, candidatos por etapa, tempo médio de processo).
- Ser extensível para futuras integrações (ex.: eSocial, sistemas de folha, APIs de verificação de background).

### Benefícios esperados

- **Redução de custo**: Eliminação ou redução drástica de assinaturas de ferramentas externas.
- **Maior controle e customização**: Adaptação total ao fluxo interno da empresa (ex.: etapas específicas por área ou região).
- **Melhor experiência do candidato**: Processo transparente, com comunicação clara de status.
- **Conformidade legal**: Tratamento adequado de dados pessoais, com registro de consentimento e possibilidade de exclusão.
- **Produtividade da equipe de RH**: Centralização de informações, histórico de ações (audit log) e redução de trabalho manual.
- **Tomada de decisão baseada em dados**: Visão consolidada do pipeline de recrutamento.

### Escopo resumido (MVP)

O sistema abrange:

- Cadastro de empresas e usuários com controle de acesso por papéis.
- Gestão completa de vagas e processos seletivos (criação, etapas customizáveis, movimentação de candidatos).
- Perfil de candidato com upload e parsing básico de currículo (PDF).
- Dashboards básicos para RH e gestores.
- Registro de histórico de ações e notificações simples por e-mail (futura expansão).

Tecnologias principais: FastAPI (backend), React (frontend), PostgreSQL (banco de dados), JWT + RBAC (autenticação).

### Declaração de valor

O NEXUM é um sistema corporativo sólido, projetado com base em processos reais de RH no mercado brasileiro, priorizando segurança, usabilidade e manutenibilidade. Não busca ser uma solução disruptiva com inteligência artificial avançada, mas sim uma ferramenta confiável, escalável e totalmente controlada pela empresa — exatamente o tipo de software que gera valor estável e duradouro em produção por anos.

Última atualização: 05 de janeiro de 2026  
Autor do projeto: Davi Iwasaki Silva