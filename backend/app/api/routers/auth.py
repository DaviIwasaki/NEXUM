# app/api/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from app.infrastructure.db import get_db
from app.domain.models import User, UserRole
from app.config.settings import settings
from pydantic import BaseModel

import PyPDF2
import io

print("=== AUTH.PY CARREGADO COM SUCESSO ===")

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelo de resposta (token)
class Token(BaseModel):
    access_token: str
    token_type: str

# Funções auxiliares (já devem existir, mas repito para clareza)
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# Novo endpoint register com upload
@router.post("/register", response_model=Token)
async def register(
    nome: str = Form(...),
    email: str = Form(...),
    cpf: str = Form(...),
    telefone: Optional[str] = Form(None),
    endereco: str = Form(...),
    pretensao_salarial: Optional[str] = Form(None),
    senha: str = Form(...),
    confirmar_senha: str = Form(...),
    consentimento_lgpd: bool = Form(...),
    curriculo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    if senha != confirmar_senha:
        raise HTTPException(status_code=400, detail="As senhas não conferem")

    if not consentimento_lgpd:
        raise HTTPException(status_code=400, detail="Consentimento LGPD é obrigatório")

    # Limpa CPF
    cpf_limpo = cpf.replace(".", "").replace("-", "").strip()

    # Verificações de duplicidade
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    if db.query(User).filter(User.cpf == cpf_limpo).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado")

    # Hash da senha
    hashed_password = get_password_hash(senha)

    # Extrai texto do currículo (se enviado)
    curriculo_texto = None
    if curriculo and curriculo.content_type == "application/pdf":
        try:
            contents = await curriculo.read()
            pdf_file = io.BytesIO(contents)
            reader = PyPDF2.PdfReader(pdf_file)
            full_text = ""
            for page in reader.pages:
                full_text += page.extract_text() or ""
            curriculo_texto = full_text[:2000]  # limite razoável
        except Exception as e:
            print(f"Erro ao extrair PDF: {e}")
            curriculo_texto = None  # continua mesmo com erro

    # Cria o usuário
    new_user = User(
        nome=nome.strip(),
        email=email.strip().lower(),
        cpf=cpf_limpo,
        telefone=telefone.strip() if telefone else None,
        endereco=endereco.strip(),
        pretensao_salarial=pretensao_salarial.strip() if pretensao_salarial else None,
        senha_hash=hashed_password,
        role=UserRole.CANDIDATO,
        consentimento_lgpd=consentimento_lgpd,
        curriculo_texto=curriculo_texto,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Gera token
    access_token = create_access_token(
        data={"sub": new_user.email, "role": new_user.role.value},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

from app.api.dependencies import get_current_active_user, require_role

@router.get("/me", response_model=dict) 
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "nome": current_user.nome,
        "email": current_user.email,
        "role": current_user.role.value,
        "cpf": current_user.cpf,
        "consentimento_lgpd": current_user.consentimento_lgpd,
        "data_criacao": current_user.data_criacao.isoformat() if current_user.data_criacao else None
    }

@router.get("/admin-only")
def admin_only(current_user: User = Depends(require_role("Admin"))):
    return {"message": f"Bem-vindo, Admin {current_user.nome}! Você tem acesso total."}

@router.get("/debug-test")
def debug_test():
    return {"status": "auth router funcionando!", "prefix": router.prefix}