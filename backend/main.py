from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, users, jobs, admin, config

app = FastAPI(title="NEXUM API")

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(admin.router)
app.include_router(config.router)

# Middleware CORS reforçado
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                     # permite tudo
    allow_credentials=True,
    allow_methods=["*"],                     # permite todos métodos
    allow_headers=["*"],                     # permite todos headers
    expose_headers=["*"],
    max_age=3600,
)
app.include_router(auth.router)
app.include_router(users.router)

# Rota OPTIONS manual para debug (se CORS persistir)
@app.options("/users/{id}")
async def options_user_id(id: int):
    return {"message": "OK"}

@app.get("/")
def read_root():
    return {"message": "NEXUM API rodando"}