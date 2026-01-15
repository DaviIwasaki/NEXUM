# app/api/routers/users.py
import io
import PyPDF2
from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from fastapi import Form, File, UploadFile

from app.infrastructure.db import get_db
from app.domain.models import (
    User, UserRole, UserActivity, Candidatura, EmployeeContract,
    EmployeeDocument, DailyHistory, ContractHistory, PDI
)
from app.api.dependencies import (
    get_current_active_user,
    require_role,
    require_any_role
)

router = APIRouter(prefix="/users", tags=["users"])

# Modelos de saída (Pydantic) para cada endpoint
class UserProfileOut(BaseModel):
    id: int
    nome: str
    email: str
    telefone: Optional[str] = None
    cpf: str
    endereco: Optional[str] = None
    pretensao_salarial: Optional[str] = None
    role: str
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    salario_atual: Optional[str] = None
    admissao: Optional[str] = None
    status: str  # "CANDIDATO" ou "Ativo"


class ActivityOut(BaseModel):
    data: str
    titulo: str
    descricao: str
    acao: Optional[str] = None


class CandidaturaOut(BaseModel):
    id: int
    job_id: int
    vaga: str
    status: str
    data: str
    empresa: str
    etapa_final: str
    nota_media: Optional[str] = None
    feedback_resumo: Optional[str] = None


class ContractOut(BaseModel):
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    salario_atual: Optional[str] = None
    admissao: Optional[str] = None


class DocumentOut(BaseModel):
    nome: str
    status: str


class DailyHistoryOut(BaseModel):
    data: str
    evento: str
    motivo: str
    status: str


class ContractHistoryOut(BaseModel):
    data: str
    evento: str
    cargo: str
    salario: str
    novo_dept: Optional[str] = None


class PDIOut(BaseModel):
    descricao: str
    data_geracao: str


# GET /users/{id} - Perfil completo (Dados Pessoais + campos contratuais)
@router.get("/{id}", response_model=UserProfileOut)
def get_user_profile(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("CANDIDATO", "COLABORADOR", "RH", "GESTOR", "ADMIN"))
):
    try:
        user = db.query(User).filter(User.id == id, User.is_active == True).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        # RBAC: GESTOR só vê da mesma empresa
        if current_user.role == UserRole.GESTOR and user.empresa_id != current_user.empresa_id:
            raise HTTPException(status_code=403, detail="Acesso negado")

        # Construção segura do perfil
        profile_data = {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "telefone": user.telefone or "",
            "cpf": user.cpf,
            "endereco": user.endereco or "",
            "pretensao_salarial": user.pretensao_salarial or "",
            "role": user.role.value if user.role else "CANDIDATO",
            "cargo": None,
            "departamento": None,
            "salario_atual": None,
            "admissao": None,
            "status": "Ativo" if user.role != UserRole.CANDIDATO else "CANDIDATO",
        }

        # Contrato (se existir)
        if user.contract:
            profile_data.update({
                "cargo": user.contract.cargo or "",
                "departamento": user.contract.departamento or "",
                "salario_atual": user.contract.salario_atual or "",
                "admissao": user.contract.data_admissao.isoformat() if user.contract.data_admissao else None,
            })

        return UserProfileOut(**profile_data)

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        # Log detalhado no terminal
        print(f"[ERRO CRÍTICO em /users/{id}]: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro interno no servidor: {str(e)}")


# GET /users/{id}/activities - Histórico de Atividades (tab Atividades)
@router.get("/{id}/activities", response_model=List[ActivityOut])
def get_user_activities(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("CANDIDATO"))
):
    if id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    activities = db.query(UserActivity).filter(UserActivity.user_id == id).order_by(UserActivity.data.desc()).limit(20).all()

    return [
        ActivityOut(
            data=act.data.strftime("%d/%m/%Y %H:%M"),
            titulo=act.titulo,
            descricao=act.descricao,
            acao=act.acao
        ) for act in activities
    ]


# GET /users/{id}/candidatures - Histórico de Candidaturas (tab Candidatura)
@router.get("/{id}/candidatures", response_model=List[CandidaturaOut])
def get_user_candidatures(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("CANDIDATO"))
):
    if id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    candidaturas = db.query(Candidatura).filter(Candidatura.user_id == id).order_by(Candidatura.data.desc()).all()
    
    return [
    CandidaturaOut(
        id=c.id,
        job_id=c.job_id,           
        vaga=c.vaga,
        status=c.status,
        data=c.data,
        empresa=c.empresa,
        etapa_final=c.etapa_atual,
        nota_media=c.nota_media,
        feedback_resumo=c.feedback_resumo
    ) for c in candidaturas
]


# GET /users/{id}/contract - Dados Contratuais (tab Dados Contratuais)
@router.get("/{id}/contract", response_model=ContractOut)
def get_user_contract(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("COLABORADOR", "RH", "ADMIN"))
):
    if id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    contract = db.query(EmployeeContract).filter(EmployeeContract.user_id == id).first()
    if not contract:
        return ContractOut()
    
    return ContractOut(
        cargo=contract.cargo,
        departamento=contract.departamento,
        salario_atual=contract.salario_atual,
        admissao=contract.data_admissao.isoformat() if contract.data_admissao else None
    )


# GET /users/{id}/documents - Documentos (tab Documentos)
@router.get("/{id}/documents", response_model=List[DocumentOut])
def get_user_documents(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("COLABORADOR", "RH", "ADMIN"))
):
    if id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    documents = db.query(EmployeeDocument).filter(EmployeeDocument.user_id == id).all()
    return [DocumentOut(nome=d.nome, status=d.status) for d in documents]


# GET /users/{id}/daily-history - Histórico Cotidiano (tab Histórico)
@router.get("/{id}/daily-history", response_model=List[DailyHistoryOut])
def get_daily_history(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("COLABORADOR", "RH", "ADMIN"))
):
    if id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    history = db.query(DailyHistory).filter(DailyHistory.user_id == id).order_by(DailyHistory.data.desc()).limit(20).all()
    return [DailyHistoryOut(data=h.data, evento=h.evento, motivo=h.motivo, status=h.status) for h in history]


# GET /users/{id}/contract-history - Histórico Contratual (tab Histórico Contratual)
@router.get("/{id}/contract-history", response_model=List[ContractHistoryOut])
def get_contract_history(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("COLABORADOR", "RH", "ADMIN"))
):
    if id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    history = db.query(ContractHistory).filter(ContractHistory.user_id == id).order_by(ContractHistory.data.desc()).limit(20).all()
    return [ContractHistoryOut(data=h.data, evento=h.evento, cargo=h.cargo, salario=h.salario, novo_dept=h.novo_dept) for h in history]


# GET /users/{id}/pdi - PDI (tab PDI)
@router.get("/{id}/pdi", response_model=PDIOut)
def get_pdi(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("COLABORADOR", "RH", "ADMIN"))
):
    if id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    pdi = db.query(PDI).filter(PDI.user_id == id).first()
    if not pdi:
        return PDIOut(descricao="PDI não gerado ainda", data_geracao=datetime.now().isoformat())
    
    return PDIOut(descricao=pdi.descricao, data_geracao=pdi.data_geracao.isoformat())


# PATCH /users/{id} - Editar perfil (limitado)
@router.patch("/{id}")
def update_user_profile(
    id: int,
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    user = db.query(User).filter(User.id == id).first()
    if not user or (id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]):
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Campos imutáveis
    immutable_fields = {"nome", "cpf", "endereco"}
    if any(field in update_data for field in immutable_fields):
        raise HTTPException(status_code=400, detail="Campos imutáveis: nome, CPF, endereço")
    
    for field, value in update_data.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    user.data_atualizacao = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return {"message": "Perfil atualizado com sucesso"}

from fastapi import UploadFile, File

@router.post("/{id}/curriculo")
async def upload_curriculo(
    id: int,
    curriculo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if id != current_user.id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(403, "Acesso negado")

    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(404, "Usuário não encontrado")

    if not curriculo.content_type == "application/pdf":
        raise HTTPException(400, "Apenas arquivos PDF são aceitos")

    try:
        contents = await curriculo.read()
        pdf_file = io.BytesIO(contents)
        reader = PyPDF2.PdfReader(pdf_file)
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() or ""
        texto_extraido = full_text[:5000]  # limite maior que no register

        user.curriculo_texto = texto_extraido
        user.data_atualizacao = datetime.utcnow()
        db.commit()
        db.refresh(user)

        return {"message": "Currículo enviado e texto extraído com sucesso"}
    except Exception as e:
        raise HTTPException(500, f"Erro ao processar PDF: {str(e)}")
    
# =============================================
# NOVOS ENDPOINTS PARA PERSONPROFILE COMPLETO
# =============================================

@router.patch("/{id}/contract")
def update_employee_contract(
    id: int,
    cargo: Optional[str] = None,
    departamento: Optional[str] = None,
    salario_atual: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("RH", "ADMIN"))
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(404, "Usuário não encontrado")
    
    if user.role == UserRole.CANDIDATO:
        raise HTTPException(400, "Usuário ainda é CANDIDATO")

    contract = db.query(EmployeeContract).filter(EmployeeContract.user_id == id).first()
    if not contract:
        raise HTTPException(404, "Contrato não encontrado")

    # Salva histórico antes da mudança
    old_cargo = contract.cargo
    old_salario = contract.salario_atual
    old_dept = contract.departamento

    if cargo is not None:
        contract.cargo = cargo
    if departamento is not None:
        contract.departamento = departamento
    if salario_atual is not None:
        contract.salario_atual = salario_atual

    db.commit()

    # Registra no histórico contratual
    history = ContractHistory(
        user_id=id,
        data=datetime.now().strftime("%d/%m/%Y"),
        evento="Alteração Contratual",
        cargo=contract.cargo,
        salario=contract.salario_atual,
        novo_dept=contract.departamento if contract.departamento != old_dept else None
    )
    db.add(history)
    db.commit()

    return {"message": "Contrato atualizado com sucesso", "novo_cargo": contract.cargo}


@router.post("/{id}/documents")
async def upload_document(
    id: int,
    nome: str = Form(...),  # ex: "Contrato de Trabalho", "Exame Admissional"
    arquivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("RH", "ADMIN", "COLABORADOR"))
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(404, "Usuário não encontrado")

    if current_user.id != id and current_user.role not in [UserRole.RH, UserRole.ADMIN]:
        raise HTTPException(403, "Acesso negado")

    # Simulação de salvamento (em produção você usaria S3, MinIO, etc.)
    # Por enquanto vamos só marcar como "Enviado" ou "Assinado"
    status = "Assinado" if "assinad" in nome.lower() or "contrato" in nome.lower() else "Enviado"

    document = EmployeeDocument(
        user_id=id,
        nome=nome,
        status=status,
        arquivo_url=f"/uploads/documents/{arquivo.filename}"  # caminho fictício
    )
    db.add(document)
    db.commit()

    return {"message": f"Documento '{nome}' enviado com sucesso", "status": status}


@router.post("/{id}/dismiss")
def dismiss_employee(
    id: int,
    motivo: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_role("RH", "ADMIN"))
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(404, "Usuário não encontrado")

    if user.role == UserRole.CANDIDATO:
        raise HTTPException(400, "Não é possível demitir um CANDIDATO")

    contract = db.query(EmployeeContract).filter(EmployeeContract.user_id == id).first()

    # Registra demissão no histórico
    history = ContractHistory(
        user_id=id,
        data=datetime.now().strftime("%d/%m/%Y"),
        evento="Demissão",
        cargo=contract.cargo if contract else "Não informado",
        salario=contract.salario_atual if contract else "Não informado",
    )
    db.add(history)

    # Desativa usuário e remove cargo
    user.is_active = False
    user.role = UserRole.CANDIDATO  # opcional: volta pra CANDIDATO
    if contract:
        db.delete(contract)  # ou só limpa os campos

    db.commit()

    return {"message": "COLABORADOR demitido com sucesso", "data": history.data}

@router.post("/candidaturas")
async def create_candidatura(
    job_id: int = Form(...),
    curriculo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("CANDIDATO"))
):
    if not curriculo.content_type == "application/pdf":
        raise HTTPException(400, "Apenas PDF")

    # Salva arquivo (simples, em produção use S3)
    contents = await curriculo.read()
    file_path = f"uploads/curriculos/{current_user.id}_{job_id}.pdf"
    with open(file_path, "wb") as f:
        f.write(contents)

    # Cria candidatura
    candidatura = Candidatura(
        user_id=current_user.id,
        job_id=job_id,
        status="Triagem",
        etapa_atual="Triagem",
        data=datetime.now().strftime("%d/%m/%Y"),
        empresa="Empresa da vaga",  # pegue do job
        vaga="Título da vaga"       # pegue do job
    )
    db.add(candidatura)
    db.commit()

    return {"message": "Candidatura enviada com sucesso"}