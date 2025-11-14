# 🌞 SOLCial Backend - Integração Google Solar API

API backend completa para integração com a **Google Solar API**, fornecendo endpoints para análise de potencial solar de edificações.

## 📋 Índice

- [Características](#características)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Endpoints da API](#endpoints-da-api)
- [Exemplos](#exemplos)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)
- [Documentação](#documentação)

## ✨ Características

- ✅ **Integração completa** com Google Solar API
- ✅ **Múltiplos endpoints** para diferentes necessidades
- ✅ **Validação robusta** de parâmetros
- ✅ **Tratamento de erros** detalhado
- ✅ **Suporte GET e POST** para todos os endpoints
- ✅ **Cliente JavaScript** pronto para uso no frontend
- ✅ **Suite de testes** automatizados
- ✅ **Documentação completa** da API
- ✅ **Exemplos práticos** para React, Vue.js e Node.js

## 📋 Pré-requisitos

- **Node.js** v16 ou superior
- **NPM** ou **Yarn**
- **Chave de API** do Google Solar API ([Obtenha aqui](https://developers.google.com/maps/documentation/solar))

## 🚀 Instalação

1. **Clone o repositório** (ou navegue até a pasta backend):

\`\`\`bash
cd backend
\`\`\`

2. **Instale as dependências**:

\`\`\`bash
npm install
\`\`\`

As dependências incluem:
- `express` - Framework web
- `axios` - Cliente HTTP
- `cors` - Middleware para CORS
- `dotenv` - Gerenciamento de variáveis de ambiente

## ⚙️ Configuração

1. **Copie o arquivo de exemplo**:

\`\`\`bash
cp .env.example .env
\`\`\`

2. **Edite o arquivo `.env`** e adicione sua chave da API:

\`\`\`env
GOOGLE_SOLAR_API_KEY=sua_chave_aqui
GOOGLE_SOLAR_API_URL=https://solar.googleapis.com/v1
PORT=3001
NODE_ENV=development
\`\`\`

3. **Obtenha uma chave da API**:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto ou selecione um existente
   - Ative a **Solar API**
   - Gere uma chave de API

## 🏃 Como Usar

### Iniciar o servidor:

\`\`\`bash
npm start
\`\`\`

O servidor estará disponível em: **http://localhost:3001**

### Verificar se está funcionando:

\`\`\`bash
curl http://localhost:3001/health
\`\`\`

## 📡 Endpoints da API

### 1. Health Check

\`\`\`
GET /health
\`\`\`

Verifica o status do servidor.

### 2. Building Insights

\`\`\`
GET  /api/solar/building-insights?latitude=37.4450&longitude=-122.1390&requiredQuality=HIGH
POST /api/solar/building-insights
\`\`\`

Busca informações detalhadas sobre o potencial solar de uma edificação.

**Parâmetros:**
- `latitude` (obrigatório): Latitude do local
- `longitude` (obrigatório): Longitude do local
- `requiredQuality` (opcional): LOW, MEDIUM ou HIGH (padrão: HIGH)

### 3. Data Layers

\`\`\`
GET  /api/solar/data-layers?latitude=37.4450&longitude=-122.1390&radiusMeters=50
POST /api/solar/data-layers
\`\`\`

Busca camadas de dados solares para visualização em mapas.

**Parâmetros:**
- `latitude` (obrigatório): Latitude do local
- `longitude` (obrigatório): Longitude do local
- `radiusMeters` (opcional): Raio em metros (padrão: 50)
- `requiredQuality` (opcional): LOW, MEDIUM ou HIGH (padrão: HIGH)

### 4. Solar Analysis

\`\`\`
GET  /api/solar/analysis?latitude=37.4450&longitude=-122.1390
POST /api/solar/analysis
\`\`\`

Retorna uma análise processada e simplificada do potencial solar.

**Parâmetros:**
- `latitude` (obrigatório): Latitude do local
- `longitude` (obrigatório): Longitude do local

## 💡 Exemplos

### JavaScript (Fetch)

\`\`\`javascript
// Análise solar básica
const response = await fetch(
  'http://localhost:3001/api/solar/analysis?latitude=37.4450&longitude=-122.1390'
);
const data = await response.json();

if (data.success) {
  console.log('Painéis máximos:', data.solarPotential.maxArrayPanelsCount);
  console.log('Horas de sol/ano:', data.solarPotential.maxSunshineHoursPerYear);
}
\`\`\`

### cURL

\`\`\`bash
# GET request
curl "http://localhost:3001/api/solar/analysis?latitude=37.4450&longitude=-122.1390"

# POST request
curl -X POST http://localhost:3001/api/solar/analysis \\
  -H "Content-Type: application/json" \\
  -d '{"latitude": 37.4450, "longitude": -122.1390}'
\`\`\`

### Python

\`\`\`python
import requests

response = requests.get(
    'http://localhost:3001/api/solar/analysis',
    params={'latitude': 37.4450, 'longitude': -122.1390}
)
data = response.json()

if data['success']:
    print(f"Painéis máximos: {data['solarPotential']['maxArrayPanelsCount']}")
\`\`\`

### React Component

\`\`\`jsx
import { useState } from 'react';
import SolarApiClient from './solarApiClient';

function SolarAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const client = new SolarApiClient('http://localhost:3001');

  const analyze = async (lat, lng) => {
    const result = await client.analyzeSolarPotential(lat, lng);
    if (result.success) {
      setAnalysis(result);
    }
  };

  return (
    <div>
      <button onClick={() => analyze(37.4450, -122.1390)}>
        Analisar
      </button>
      {analysis && (
        <div>
          <p>Painéis: {analysis.solarPotential.maxArrayPanelsCount}</p>
          <p>Área: {analysis.solarPotential.maxArrayAreaMeters2} m²</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

## 🧪 Testes

Execute a suite de testes automatizados:

\`\`\`bash
# Certifique-se de que o servidor está rodando em outra janela
npm start

# Em outra janela, execute os testes
node tests/testSolarApi.js
\`\`\`

Os testes verificam:
- ✅ Health check
- ✅ Building insights (GET e POST)
- ✅ Data layers
- ✅ Solar analysis
- ✅ Validação de parâmetros
- ✅ Múltiplas localizações

## 📁 Estrutura do Projeto

\`\`\`
backend/
├── services/
│   └── solarApiService.js    # Serviço de integração com Google Solar API
├── examples/
│   └── solarApiClient.js     # Cliente JavaScript para frontend
├── tests/
│   └── testSolarApi.js       # Testes automatizados
├── DockerImages/
│   └── docker-compose.yml    # Configuração Docker
├── server.js                 # Servidor Express principal
├── package.json              # Dependências
├── .env                      # Variáveis de ambiente (não commitar)
├── .env.example              # Exemplo de variáveis
├── .gitignore               # Arquivos ignorados pelo Git
├── API_DOCUMENTATION.md     # Documentação completa da API
└── README.md                # Este arquivo
\`\`\`

## 🔒 Segurança

### ⚠️ IMPORTANTE

- **Nunca commite** seu arquivo `.env` com chaves reais
- Use o `.env.example` como referência
- Mantenha suas chaves de API seguras

### Recomendações para Produção

1. **Variáveis de ambiente**: Use variáveis do sistema em produção
2. **Rate limiting**: Implemente limitação de taxa de requisições
3. **Autenticação**: Adicione autenticação nos endpoints
4. **CORS**: Configure CORS adequadamente para seu domínio
5. **HTTPS**: Use sempre HTTPS em produção
6. **Logs**: Implemente sistema de logs robusto
7. **Monitoramento**: Configure alertas e monitoramento

## 📚 Documentação

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentação completa dos endpoints
- **[Google Solar API](https://developers.google.com/maps/documentation/solar)** - Documentação oficial
- **[examples/solarApiClient.js](./examples/solarApiClient.js)** - Exemplos de uso e cliente JavaScript

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📄 Licença

ISC

## 👥 Autores

Marcelo Sabaris Carballo Pinto 
Projeto SOLCial - Integração com Google Solar API

## 🙏 Agradecimentos

- Google Solar API
- Comunidade Node.js
- Express.js
- Axios

---

**Desenvolvido com ☀️ para um futuro mais sustentável**
