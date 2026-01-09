# app/domain/models.py
from sqlalchemy import Column, Integer, String, Enum, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
from app.infrastructure.db import Base
import enum

class UserRole(str, enum.Enum):
    CANDIDATO = "Candidato"
    COLABORADOR = "Colaborador"
    GESTOR = "Gestor"
    RH = "RH"
    ADMIN = "Admin"
    AUDITOR = "Auditor"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)          # Imutável após criação (regra de negócio)
    email = Column(String(255), unique=True, index=True, nullable=False)
    cpf = Column(
        String(11),
        unique=True,
        index=True,
        nullable=False,
        comment="Somente números, sem pontos ou traços"
    )
    telefone = Column(String(20), nullable=True)
    endereco = Column(Text, nullable=True)              # Preenchido na contratação + comprovante
    senha_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CANDIDATO, nullable=False)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=True)  # multi-tenant futuro
    consentimento_lgpd = Column(Boolean, default=False, nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_atualizacao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    curriculo_texto = Column(Text, nullable=True)       # Extraído do PDF do currículo

    # Relacionamento bidirecional (ativo!)
    empresa = relationship("Empresa", back_populates="users")

    def __repr__(self):
        return f"<User {self.nome} ({self.role})>"


class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    cnpj = Column(String(14), unique=True, nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)

    # Relacionamento bidirecional (ativo!)
    users = relationship("User", back_populates="empresa")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    evento = Column(String(100), nullable=False)        # ex: LOGIN, CREATE_JOB, MOVE_CANDIDATE
    detalhes = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)      # Suporta IPv4 e IPv6
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User")