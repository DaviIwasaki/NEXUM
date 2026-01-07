# Imagem base: Python 3.10 slim
FROM python:3.10-slim

# Diretório de trabalho
WORKDIR /app

# Copia requirements e instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY . .

# Expõe porta do FastAPI
EXPOSE 8000

# Comando para rodar (uvicorn como server)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]