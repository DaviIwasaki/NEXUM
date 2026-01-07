# Imagem base: Node.js versão LTS para build React
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Build da app React
RUN npm run build

# Servidor para produção (use nginx para servir static files)
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]