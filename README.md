# SOLCial - Projeto de Engenharia de Software

## Descrição do Projeto

O SOLCial é uma aplicação web que visa tornar a energia solar mais acessível e compreensível para a população de São Paulo. A plataforma permite que moradores e pequenos comerciantes entendam:

- O potencial solar do seu endereço
- A economia estimada em comparação à energia convencional
- O impacto ambiental positivo da adesão à energia solar

## Tecnologias Utilizadas

- **Frontend**: React
- **Backend**: Node.js
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

### Backend
```bash
cd backend
npm start
```
O servidor estará rodando em `http://localhost:3001`

### Frontend
```bash
cd frontend
npm start
```
A aplicação estará rodando em `http://localhost:3000`

## Configuração

1. Configure as variáveis de ambiente nos arquivos `.env`
2. Obtenha uma chave da Google Solar API
3. Configure a chave no arquivo `.env` do backend

## Público-Alvo

- Moradores de São Paulo que buscam reduzir custos com energia
- Pequenos comerciantes que desejam previsibilidade e economia
- Gestores públicos interessados em políticas de sustentabilidade
