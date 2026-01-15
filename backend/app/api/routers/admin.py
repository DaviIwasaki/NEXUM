# app/api/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.infrastructure.db import get_db
from app.domain.models import User, UserRole
from app.api.dependencies import require_role, get_current_active_user
from app.api.routers.auth import get_password_hash  # Importe do auth.py

router = APIRouter(prefix="/admin", tags=["admin"])

class UserListItem(BaseModel):
    id: int
    nome: str
    email: str
    role: str
    cargo: Optional[str] = None
    departamento: Optional[str] = None

class UserCreateIn(BaseModel):
    nome: str
    email: str
    cpf: str
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    role: str  # "ADMIN", "RH", "GESTOR", etc.
    senha: str
    # Campos para contratação direta (apenas se role = COLABORADOR)
    cargo_id: Optional[int] = None
    departamento_id: Optional[int] = None

@router.get("/users", response_model=List[UserListItem])
def list_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    users = db.query(User).all()
    return [
        UserListItem(
            id=u.id,
            nome=u.nome,
            email=u.email,
            role=u.role.value if u.role else "CANDIDATO",
            cargo=u.cargo.nome if u.cargo else None,
            departamento=u.departamento.nome if u.departamento else None
        )
        for u in users
    ]

@router.post("/users")
def create_internal_user(
    data: UserCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    if data.role not in UserRole.__members__:
        raise HTTPException(status_code=400, detail="Role inválido")

    hashed_password = get_password_hash(data.senha)

    new_user = User(
        nome=data.nome,
        email=data.email,
        cpf=data.cpf,
        telefone=data.telefone,
        endereco=data.endereco,
        senha_hash=hashed_password,
        role=UserRole[data.role],
        consentimento_lgpd=True,
        is_active=True,
        cargo_id=data.cargo_id if data.role == "COLABORADOR" else None,
        departamento_id=data.departamento_id if data.role == "COLABORADOR" else None,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuário criado com sucesso", "id": new_user.id}

@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if new_role not in UserRole.__members__:
        raise HTTPException(status_code=400, detail="Role inválido")

    target_user.role = UserRole[new_role]
    db.commit()
    db.refresh(target_user)

    return {"message": f"Role atualizado para {new_role}"}

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if user.id == current_user.id:
        raise HTTPException(status_code=403, detail="Não é possível excluir a si mesmo")

    db.delete(user)
    db.commit()

    return {"message": "Usuário excluído com sucesso"}