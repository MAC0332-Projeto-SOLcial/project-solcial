# Projeto SOLCial - MAC0332 Engenharia de Software

## Descrição do Projeto

O SOLCial é uma aplicação web que visa tornar a energia solar mais acessível e compreensível para a população de São Paulo. A plataforma permite que moradores e pequenos comerciantes entendam:

- O potencial solar do seu endereço
- A economia estimada em comparação à energia convencional
- O impacto ambiental positivo da adesão à energia solar

## Tecnologias Utilizadas

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **API**: Google Solar API

## Estrutura do Projeto

```
project-solcial/
├── frontend/          # Aplicação React
├── backend/           # Servidor Node.js
├── .env              # Variáveis de ambiente globais
├── .gitignore        # Arquivos ignorados pelo Git
└── README.md         # Este arquivo
```

## Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação das Dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Executando o Projeto

#### Backend
```bash
cd backend
npm start
```
O servidor estará rodando em `http://localhost:3001`

#### Frontend
```bash
cd frontend
npm start
```
A aplicação estará rodando em `http://localhost:3000`

### Scripts Disponíveis

#### Backend
- `npm start` - Inicia o servidor
- `npm run dev` - Inicia o servidor em modo desenvolvimento

#### Frontend
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes

## Configuração

### Variáveis de Ambiente

1. **Backend** (`backend/.env`):
   - `GOOGLE_SOLAR_API_KEY` - Chave da Google Solar API
   - `GOOGLE_MAPS_API_KEY` - Chave da Google Maps API
   - `PORT` - Porta do servidor (padrão: 3001)

2. **Frontend** (`frontend/.env`):
   - `REACT_APP_API_URL` - URL do backend (padrão: http://localhost:3001)
   - `REACT_APP_GOOGLE_MAPS_API_KEY` - Chave do Google Maps para o frontend

3. **Global** (`.env`):
   - Configurações gerais do projeto

### APIs Necessárias

1. **Google Solar API**: Para análise de potencial solar
2. **Google Maps API**: Para geocoding e mapas

### Primeira Execução

1. Clone o repositório
2. Instale as dependências do backend e frontend
3. Configure as variáveis de ambiente
4. Execute o backend e frontend em terminais separados


