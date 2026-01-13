# test_auth.py - rode isso para isolar
from fastapi import FastAPI
from app.api.routers.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)