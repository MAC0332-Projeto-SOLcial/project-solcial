# SOLCial Backend API

API backend para integração com **Google Solar API**, fornecendo informações sobre potencial solar de edifícios e geocodificação de endereços.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Testes](#testes)


## 📦 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Chave de API do Google Cloud Platform com as seguintes APIs habilitadas:
  - Google Solar API
  - Google Geocoding API

## 🚀 Instalação

1. Clone o repositório e navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com as credenciais reais:

```env
# Chave da API do Google Cloud Platform
GCLOUD_API_KEY=chave_api_aqui
```

**Nota:** O arquivo `.env` não deve ser commitado no repositório. Use o `.env.example` como referência para as variáveis necessárias.

## 💻 Uso

Inicie o servidor:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou na porta configurada no `.env`).



## 📡 Endpoints

### `GET /`

Rota raiz que retorna informações do servidor.

**Resposta:**
```json
{
  "message": "SOLCial API Server is running!"
}
```

---

### `GET /coordinates`

Converte um endereço em coordenadas geográficas.

**Body (JSON):**
```json
{
  "address": "Av. Paulista, 1000, São Paulo, SP"
}
```

**Resposta de sucesso (200):**
```json
{
  "formattedAddress": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100, Brasil",
  "latitude": -23.5614,
  "longitude": -46.6560
}
```

---

### `GET /apisolar`

Busca informações sobre o potencial solar de um edifício baseado em coordenadas geográficas.

**Body (JSON):**
```json
{
  "latitude": -23.5614,
  "longitude": -46.6560
}
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "maxArrayPanelsCount": 42,
  "solarPanelConfigs": [...],
  "maxSunshineHoursPerYear": 1800,
  "carbonOffsetFactorKgPerMwh": 0.5
}
```

## 🧪 Testes

Execute os testes unitários:

```bash
npm test
```

Execute os testes em modo watch (re-executa ao detectar mudanças):

```bash
npm run test:watch
```
