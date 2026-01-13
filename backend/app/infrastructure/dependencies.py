# app/infrastructure/dependencies.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.db import SessionLocal, get_db  # get_db já existe no db.py

# Para usar em rotas: db: Session = Depends(get_db)