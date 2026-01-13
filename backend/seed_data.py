from datetime import datetime
from app.infrastructure.db import SessionLocal
from app.domain.models import Activity, Candidatura
db = SessionLocal()
db.add(Activity(user_id=3, data=datetime.now(), titulo="Teste Atividade", descricao="Descrição longa", acao="Ver"))
db.add(Candidatura(user_id=3, vaga="Dev React", status="Contratado", data="07/01/2026", empresa="NEXUM", etapa_atual="3"))
db.commit()