FROM node:18-alpine
WORKDIR /app

# Copiar backend
COPY package*.json ./
RUN npm install
COPY . .

# Criar link simbólico para frontend
RUN ln -sf /app/frontend /app/frontend

CMD ["node", "server.js"]
