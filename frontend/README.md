# SOLCial Frontend

Aplicação React para visualização do potencial solar de edifícios, permitindo que moradores e pequenos comerciantes entendam o potencial solar do seu endereço, economia estimada e impacto ambiental.

> **Nota:** Para instruções de instalação e configuração inicial, consulte o [README principal](../README.md).

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e preencha com as credenciais reais:

```env
# URL do backend API
REACT_APP_API_URL=http://localhost:3001

# Chave da API do Google Maps (opcional, se usar mapas no frontend)
REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Nota:** O arquivo `.env` não deve ser commitado no repositório. Use o `.env.example` como referência para as variáveis necessárias.

A aplicação estará disponível em `http://localhost:3000` após executar `npm start`.

## Build de Produção

Para criar um build de produção:

```bash
npm run build
```

O build será gerado na pasta `build/` e estará pronto para deploy.

## Testes

A infraestrutura de testes está configurada com **React Testing Library** e **Jest**. Atualmente existe apenas um teste básico em `App.test.js` que verifica se a aplicação renderiza corretamente.

Execute os testes:

```bash
npm test
```

