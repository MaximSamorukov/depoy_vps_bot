FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Контейнер используется только для сборки
# dist/ монтируется наружу через volume для nginx на хосте
