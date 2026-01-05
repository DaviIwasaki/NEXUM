erDiagram

    EMPRESA {
        UUID id PK
        VARCHAR cnpj
        VARCHAR nome
        TEXT endereco
        TIMESTAMP data_criacao
        BOOLEAN consentimento_lgpd
    }

    USUARIO {
        UUID id PK
        UUID empresa_id FK
        VARCHAR email
        VARCHAR senha_hash
        ENUM papel
        TIMESTAMP data_criacao
        TIMESTAMP ultimo_login
    }

    PESSOA {
        UUID id PK
        UUID usuario_id FK
        VARCHAR cpf
        VARCHAR nome_completo
        VARCHAR telefone
        TEXT endereco
        DECIMAL pretensao_salarial
        JSONB dados_diversidade
        BOOLEAN consentimento_dados
        TIMESTAMP data_criacao
    }

    VAGA {
        UUID id PK
        UUID empresa_id FK
        VARCHAR titulo
        TEXT descricao
        TEXT requisitos
        DECIMAL salario
        ENUM status
        TIMESTAMP data_abertura
        TIMESTAMP data_encerramento
    }

    PROCESSO_SELETIVO {
        UUID id PK
        UUID vaga_id FK
        TEXT descricao
        ENUM status
        TIMESTAMP data_inicio
        TIMESTAMP data_fim
    }

    ETAPA {
        UUID id PK
        UUID processo_id FK
        VARCHAR nome
        INTEGER ordem
        ENUM responsavel_papel
        TEXT descricao
        ENUM status_padrao
    }

    CURRICULO {
        UUID id PK
        UUID pessoa_id FK
        VARCHAR arquivo_path
        TEXT texto_extraido
        TIMESTAMP data_upload
    }

    CANDIDATURA {
        UUID id PK
        UUID pessoa_id FK
        UUID processo_id FK
        UUID etapa_atual_id FK
        ENUM status
        TIMESTAMP data_aplicacao
        TEXT nota_avaliacao
    }

    EMPRESA ||--o{ USUARIO : possui
    EMPRESA ||--o{ VAGA : publica

    USUARIO ||--|| PESSOA : representa

    VAGA ||--|| PROCESSO_SELETIVO : possui
    PROCESSO_SELETIVO ||--o{ ETAPA : contem

    PESSOA ||--o{ CURRICULO : anexa
    PESSOA ||--o{ CANDIDATURA : realiza

    PROCESSO_SELETIVO ||--o{ CANDIDATURA : recebe
    ETAPA ||--o{ CANDIDATURA : define_etapa_atual
