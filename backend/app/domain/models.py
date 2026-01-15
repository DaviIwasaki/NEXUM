from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    Text,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.infrastructure.db import Base


# =====================
# ENUMS
# =====================

class UserRole(str, enum.Enum):
    CANDIDATO = "CANDIDATO"
    COLABORADOR = "COLABORADOR"
    GESTOR = "GESTOR"
    RH = "RH"
    ADMIN = "ADMIN"
    AUDITOR = "AUDITOR"


# =====================
# EMPRESA (mantida como singleton)
# =====================

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
    cnpj = Column(String(255), nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)


# =====================
# USUÁRIOS (sem empresa_id)
# =====================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    cpf = Column(String(255), nullable=False, unique=True, index=True)

    telefone = Column(String(255))
    endereco = Column(Text)

    senha_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, name="userrole"), nullable=False)

    consentimento_lgpd = Column(Boolean, default=False)

    cargo_id = Column(Integer, ForeignKey("cargos.id"), nullable=True)
    departamento_id = Column(Integer, ForeignKey("departamentos.id"), nullable=True)

    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    is_active = Column(Boolean, default=True)

    curriculo_texto = Column(Text)
    pretensao_salarial = Column(String(255))

    # Relacionamentos
    cargo = relationship("Cargo", foreign_keys=[cargo_id])
    departamento = relationship("Departamento", foreign_keys=[departamento_id])

    candidaturas = relationship("Candidatura", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
    contract = relationship("EmployeeContract", uselist=False, back_populates="user", cascade="all, delete-orphan")
    documents = relationship("EmployeeDocument", back_populates="user", cascade="all, delete-orphan")
    daily_histories = relationship("DailyHistory", back_populates="user", cascade="all, delete-orphan")
    contract_histories = relationship("ContractHistory", back_populates="user", cascade="all, delete-orphan")
    pdi = relationship("PDI", uselist=False, back_populates="user", cascade="all, delete-orphan")

    departamentos_gerenciados = relationship("Departamento", back_populates="gerente", foreign_keys="[Departamento.gerente_id]")


# =====================
# AUDITORIA
# =====================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    evento = Column(String(255), nullable=False)
    detalhes = Column(Text)
    ip_address = Column(String(255))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User")


# =====================
# RECRUTAMENTO
# =====================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    titulo = Column(String(255), nullable=False)

    status = Column(String(255), default="Aberta")
    data_abertura = Column(DateTime, default=datetime.utcnow)
    prazo = Column(DateTime) 
    resumo = Column(Text) 
    descricao = Column(Text) 
    requisitos = Column(Text) 


class Candidatura(Base):
    __tablename__ = "candidaturas"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    status = Column(String(255))
    etapa_atual = Column(String(255))
    nota_media = Column(String(255))

    feedback_resumo = Column(Text)

    data = Column(String(255))
    vaga = Column(String(255))

    user = relationship("User", back_populates="candidaturas")
    job = relationship("Job")


# =====================
# ATIVIDADES / HISTÓRICO
# =====================

class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    data = Column(DateTime)
    titulo = Column(String(255))
    descricao = Column(Text)
    acao = Column(String(255))

    user = relationship("User", back_populates="activities")


class DailyHistory(Base):
    __tablename__ = "daily_histories"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    data = Column(String(255))
    evento = Column(String(255))
    motivo = Column(Text)
    status = Column(String(255))

    user = relationship("User", back_populates="daily_histories")


class ContractHistory(Base):
    __tablename__ = "contract_histories"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    data = Column(String(255))
    evento = Column(String(255))
    cargo = Column(String(255))
    salario = Column(String(255))
    novo_dept = Column(String(255))

    user = relationship("User", back_populates="contract_histories")


# =====================
# CONTRATO / DOCUMENTOS
# =====================

class EmployeeContract(Base):
    __tablename__ = "employee_contracts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    cargo = Column(String(255))
    departamento = Column(String(255))
    salario_atual = Column(String(255))
    data_admissao = Column(DateTime)

    user = relationship("User", back_populates="contract")


class EmployeeDocument(Base):
    __tablename__ = "employee_documents"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    nome = Column(String(255))
    status = Column(String(255))
    arquivo_url = Column(String(255))

    user = relationship("User", back_populates="documents")


# =====================
# PDI
# =====================

class PDI(Base):
    __tablename__ = "pdi"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    descricao = Column(Text)
    data_geracao = Column(DateTime)

    user = relationship("User", back_populates="pdi")


# =====================
# ESTRUTURA ORGANIZACIONAL
# =====================

class Departamento(Base):
    __tablename__ = "departamentos"

    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False, unique=True)
    descricao = Column(Text, nullable=True)
    gerente_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    gerente = relationship("User", foreign_keys=[gerente_id], back_populates="departamentos_gerenciados")
    cargos = relationship("Cargo", back_populates="departamento", cascade="all, delete-orphan")
    users = relationship("User", foreign_keys="[User.departamento_id]", back_populates="departamento")


class Cargo(Base):
    __tablename__ = "cargos"

    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    nivel = Column(String(50), nullable=True)
    descricao = Column(Text, nullable=True)
    departamento_id = Column(Integer, ForeignKey("departamentos.id"), nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    departamento = relationship("Departamento", back_populates="cargos")
    users = relationship("User", foreign_keys="[User.cargo_id]", back_populates="cargo")