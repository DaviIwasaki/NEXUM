# app/api/routers/config.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.infrastructure.db import get_db
from app.domain.models import Departamento, Cargo, User, UserRole
from app.api.dependencies import require_role, get_current_active_user

router = APIRouter(prefix="/config", tags=["config"])

class DepartamentoOut(BaseModel):
    id: int
    nome: str
    gerente_nome: Optional[str] = None
    empresa_nome: Optional[str] = None

class CargoOut(BaseModel):
    id: int
    nome: str
    nivel: Optional[str] = None
    departamento_nome: str

class DepartamentoCreate(BaseModel):
    nome: str
    gerente_id: Optional[int] = None  # Aceita null

class CargoCreate(BaseModel):
    nome: str
    nivel: Optional[str] = None
    departamento_id: int

@router.get("/departamentos", response_model=List[DepartamentoOut])
def list_departamentos(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    depts = db.query(Departamento).all()
    return [
        DepartamentoOut(
            id=d.id,
            nome=d.nome,
            gerente_nome=d.gerente.nome if d.gerente else None
        ) for d in depts
    ]

@router.post("/departamentos")
def create_departamento(
    data: DepartamentoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    gerente = None
    if data.gerente_id is not None:
        gerente = db.query(User).filter(User.id == data.gerente_id).first()
        if not gerente:
            raise HTTPException(status_code=404, detail="Gerente não encontrado")

    novo_dept = Departamento(
        nome=data.nome,
        gerente_id=data.gerente_id,
    )
    db.add(novo_dept)
    db.commit()
    db.refresh(novo_dept)
    return {"message": "Departamento criado", "id": novo_dept.id}

@router.get("/cargos", response_model=List[CargoOut])
def list_cargos(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    cargos = db.query(Cargo).all()
    return [
        CargoOut(
            id=c.id,
            nome=c.nome,
            nivel=c.nivel,
            departamento_nome=c.departamento.nome if c.departamento else "Sem departamento"
        ) for c in cargos
    ]

@router.post("/cargos")
def create_cargo(
    data: CargoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    dept = db.query(Departamento).filter(Departamento.id == data.departamento_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Departamento não encontrado")

    novo_cargo = Cargo(
        nome=data.nome,
        nivel=data.nivel,
        departamento_id=data.departamento_id
    )
    db.add(novo_cargo)
    db.commit()
    db.refresh(novo_cargo)
    return {"message": "Cargo criado", "id": novo_cargo.id}