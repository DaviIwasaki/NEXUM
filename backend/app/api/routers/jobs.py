# app/api/routers/jobs.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from pydantic import BaseModel

from app.infrastructure.db import get_db
from app.domain.models import Job, Candidatura
from app.api.dependencies import get_current_active_user, User

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobOut(BaseModel):
    id: int
    titulo: str
    status: str
    data_abertura: str | None
    num_candidatos: int

class JobDetailOut(BaseModel):
    id: int
    titulo: str
    status: str
    data_abertura: str | None
    prazo: str | None
    resumo: str | None
    descricao: str | None
    requisitos: List[str]
    num_candidatos: int
    metrics: dict

@router.get("/", response_model=List[JobOut])
def get_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    jobs = db.query(Job).all()
    result = []
    for job in jobs:
        num_candidatos = db.query(Candidatura).filter(Candidatura.job_id == job.id).count()
        result.append({
            "id": job.id,
            "titulo": job.titulo,
            "status": job.status,
            "data_abertura": job.data_abertura.isoformat() if job.data_abertura else None,
            "num_candidatos": num_candidatos
        })
    return result

@router.get("/{id}", response_model=JobDetailOut)
def get_job_detail(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada")

    num_candidatos = db.query(Candidatura).filter(Candidatura.job_id == id).count()

    stages_count = db.query(
        Candidatura.etapa_atual,
        func.count(Candidatura.id).label("count")
    ).filter(Candidatura.job_id == id).group_by(Candidatura.etapa_atual).all()

    metrics = {
        "stages": {stage or "Sem etapa": count for stage, count in stages_count},
        "avg_time_days": 18,  # TODO: calcular real
        "total_candidatos": num_candidatos
    }

    return {
        "id": job.id,
        "titulo": job.titulo,
        "status": job.status,
        "data_abertura": job.data_abertura.isoformat() if job.data_abertura else None,
        "prazo": job.prazo.isoformat() if job.prazo else None,
        "resumo": job.resumo,
        "descricao": job.descricao,
        "requisitos": job.requisitos.split("\n") if job.requisitos else [],
        "num_candidatos": num_candidatos,
        "metrics": metrics
    }