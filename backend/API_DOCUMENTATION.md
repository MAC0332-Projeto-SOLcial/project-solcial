# SOLCial Backend API

API backend para integração com Google Solar API, fornecendo endpoints para análise de potencial solar de edificações.

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- NPM ou Yarn
- Chave de API do Google Solar API

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` e adicione sua chave da Google Solar API:
```env
GOOGLE_SOLAR_API_KEY=sua_chave_aqui
GOOGLE_SOLAR_API_URL=https://solar.googleapis.com/v1
PORT=3001
NODE_ENV=development
```

## 🏃 Como Executar

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3001`

## 📡 Endpoints Disponíveis

### 1. Health Check
```
GET /health
```
Verifica o status do servidor.

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-05T12:00:00.000Z",
  "uptime": 123.456
}
```

---

### 2. Building Insights (Insights de Edificação)
Busca informações detalhadas sobre o potencial solar de uma edificação.

#### Via GET
```
GET /api/solar/building-insights?latitude=37.4450&longitude=-122.1390&requiredQuality=HIGH
```

#### Via POST
```
POST /api/solar/building-insights
Content-Type: application/json

{
  "latitude": 37.4450,
  "longitude": -122.1390,
  "requiredQuality": "HIGH"
}
```

**Parâmetros:**
- `latitude` (obrigatório): Latitude do local
- `longitude` (obrigatório): Longitude do local
- `requiredQuality` (opcional): Qualidade da imagem (LOW, MEDIUM, HIGH). Padrão: HIGH

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "name": "...",
    "center": { "latitude": 37.4450, "longitude": -122.1390 },
    "boundingBox": { ... },
    "imageryDate": { "year": 2023, "month": 8, "day": 15 },
    "imageryQuality": "HIGH",
    "solarPotential": {
      "maxArrayPanelsCount": 50,
      "maxArrayAreaMeters2": 150.5,
      "maxSunshineHoursPerYear": 1800,
      "carbonOffsetFactorKgPerMwh": 428.9,
      "solarPanelConfigs": [...],
      "financialAnalyses": [...],
      "roofSegmentStats": [...]
    }
  },
  "requestInfo": {
    "latitude": 37.4450,
    "longitude": -122.1390,
    "requiredQuality": "HIGH",
    "timestamp": "2025-11-05T12:00:00.000Z"
  }
}
```

---

### 3. Data Layers (Camadas de Dados)
Busca camadas de dados solares para visualização em mapas.

#### Via GET
```
GET /api/solar/data-layers?latitude=37.4450&longitude=-122.1390&radiusMeters=50&requiredQuality=HIGH
```

#### Via POST
```
POST /api/solar/data-layers
Content-Type: application/json

{
  "latitude": 37.4450,
  "longitude": -122.1390,
  "radiusMeters": 50,
  "requiredQuality": "HIGH"
}
```

**Parâmetros:**
- `latitude` (obrigatório): Latitude do local
- `longitude` (obrigatório): Longitude do local
- `radiusMeters` (opcional): Raio em metros. Padrão: 50
- `requiredQuality` (opcional): Qualidade da imagem. Padrão: HIGH

---

### 4. Solar Analysis (Análise Solar Simplificada)
Retorna uma análise processada e simplificada do potencial solar.

#### Via GET
```
GET /api/solar/analysis?latitude=37.4450&longitude=-122.1390
```

#### Via POST
```
POST /api/solar/analysis
Content-Type: application/json

{
  "latitude": 37.4450,
  "longitude": -122.1390
}
```

**Resposta:**
```json
{
  "success": true,
  "location": {
    "latitude": 37.4450,
    "longitude": -122.1390,
    "address": "..."
  },
  "solarPotential": {
    "maxArrayPanelsCount": 50,
    "maxArrayAreaMeters2": 150.5,
    "maxSunshineHoursPerYear": 1800,
    "carbonOffsetFactorKgPerMwh": 428.9
  },
  "financialAnalyses": [...],
  "roofSegmentStats": [...],
  "solarPanelConfigs": [...],
  "buildingStats": {
    "areaMeters2": 200.5,
    "center": { ... },
    "imageryDate": { ... },
    "imageryQuality": "HIGH"
  },
  "timestamp": "2025-11-05T12:00:00.000Z"
}
```

---

## 🔧 Tratamento de Erros

Todos os endpoints retornam erros no seguinte formato:

```json
{
  "success": false,
  "error": {
    "message": "Descrição do erro",
    "status": 400,
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

**Códigos de Status HTTP:**
- `200` - Sucesso
- `400` - Requisição inválida (parâmetros faltando ou inválidos)
- `401` - Não autorizado (chave da API inválida)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

## 📝 Exemplos de Uso

### JavaScript (Fetch API)
```javascript
// GET request
const response = await fetch(
  'http://localhost:3001/api/solar/analysis?latitude=37.4450&longitude=-122.1390'
);
const data = await response.json();
console.log(data);

// POST request
const response = await fetch('http://localhost:3001/api/solar/analysis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    latitude: 37.4450,
    longitude: -122.1390
  })
});
const data = await response.json();
console.log(data);
```

### cURL
```bash
# GET request
curl "http://localhost:3001/api/solar/analysis?latitude=37.4450&longitude=-122.1390"

# POST request
curl -X POST http://localhost:3001/api/solar/analysis \
  -H "Content-Type: application/json" \
  -d '{"latitude": 37.4450, "longitude": -122.1390}'
```

### Python (requests)
```python
import requests

# GET request
response = requests.get(
    'http://localhost:3001/api/solar/analysis',
    params={'latitude': 37.4450, 'longitude': -122.1390}
)
data = response.json()
print(data)

# POST request
response = requests.post(
    'http://localhost:3001/api/solar/analysis',
    json={'latitude': 37.4450, 'longitude': -122.1390}
)
data = response.json()
print(data)
```

---

## 🏗️ Estrutura do Projeto

```
backend/
├── services/
│   └── solarApiService.js    # Serviço de integração com Google Solar API
├── server.js                  # Servidor Express principal
├── package.json              # Dependências do projeto
├── .env                      # Variáveis de ambiente (não commitar)
├── .env.example             # Exemplo de variáveis de ambiente
└── README.md                # Esta documentação
```

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca commite seu arquivo `.env` com as chaves de API reais. Use o `.env.example` como referência.

Para produção:
- Use variáveis de ambiente do servidor
- Implemente rate limiting
- Adicione autenticação nos endpoints
- Configure CORS adequadamente
- Use HTTPS

---

## 📚 Referências

- [Google Solar API Documentation](https://developers.google.com/maps/documentation/solar)
- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)

---

## 📄 Licença

ISC
