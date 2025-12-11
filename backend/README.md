# SOLCial Backend API

API backend para integração com **Google Solar API**, fornecendo informações sobre potencial solar de edifícios e geocodificação de endereços.

> **Nota:** Para instruções de instalação e configuração inicial, consulte o [README principal](../README.md).

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com as credenciais reais:

```env
# Chave da API do Google Cloud Platform
GCLOUD_API_KEY=chave_api_aqui

# URLs das APIs (valores padrão, podem ser omitidos)
GOOGLE_SOLAR_API_URL=https://solar.googleapis.com/v1
GOOGLE_GEOCODING_API_URL=https://maps.googleapis.com

# Porta do servidor
PORT=3001
```

**Nota:** O arquivo `.env` não deve ser commitado no repositório. Use o `.env.example` como referência para as variáveis necessárias.

O servidor estará disponível em `http://localhost:3001` após executar `npm start`.



## Endpoints

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

**Nota:** Este endpoint aceita um body JSON mesmo sendo um método GET.

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

**Nota:** Este endpoint aceita um body JSON mesmo sendo um método GET.

---

### `GET /solar-metrics`

Endpoint principal que combina geocodificação e análise solar, retornando métricas completas.

**Query Parameters:**
- `address` (string, obrigatório) - Endereço a ser analisado
- `energyConsumptionKwh` (string JSON, obrigatório) - Array com consumo de energia em kWh (ex: `"[100, 120, 110]"`)
- `spentMoney` (string JSON, obrigatório) - Array com valores gastos em reais (ex: `"[500, 600, 550]"`)
- `numPanels` (number, opcional) - Número de painéis solares (padrão: 1)

**Exemplo de requisição:**
```
GET /solar-metrics?address=Av.%20Paulista,%201000,%20S%C3%A3o%20Paulo,%20SP&energyConsumptionKwh=[100,120,110]&spentMoney=[500,600,550]&numPanels=1
```

**Resposta de sucesso (200):**
```json
{
  "formattedAddress": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100, Brasil",
  "maxPanels": 42,
  "solarMetrics": {
    "annualEnergyGeneration": 1800,
    "annualSavings": 900,
    "carbonOffset": 0.9
  }
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

## Testes

Execute os testes unitários:

```bash
npm test
```

Execute os testes em modo watch (re-executa ao detectar mudanças):

```bash
npm run test:watch
```
