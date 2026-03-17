# TPS.AI — Frontend

Frontend do **TPS.AI**, aplicação de apoio à Terapia Ocupacional (processamento e integração sensorial) com suporte a IA para hipóteses, atividades e escalas sugeridas.

- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS.
- **API:** Consumo da API TPS.AI via client gerado com [Orval](https://orval.dev/) a partir do OpenAPI.

---

## Pré-requisitos

- Node.js 18+
- API TPS.AI rodando (repositório `TPS_api`)

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (ou `.env.local`). Exemplo:

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | Sim | URL base da API (ex.: `http://localhost:8080`) |
| `NEXT_PUBLIC_BASE_URL` | Recomendado | URL do front (ex.: `http://localhost:3000`) — usado no callback do login com Google |

Exemplo mínimo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Desenvolvimento

1. Instale as dependências:

   ```bash
   npm install
   # ou bun install
   ```

2. Configure o `.env` (veja acima).

3. Inicie a API (no projeto `TPS_api`):

   ```bash
   cd ../TPS_api && bun run dev
   ```

4. Inicie o frontend:

   ```bash
   npm run dev
   # ou bun dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (após `build`) |
| `npm run lint` | ESLint |
| `npm run generate:api` | Regenera o client da API (Orval). **Requer a API rodando** em `NEXT_PUBLIC_API_URL`. |

---

## API e documentação

- O client da API é gerado em `src/app/_lib/api/fetch-generated/index.ts` (Orval + OpenAPI).
- Para regenerar tipos e funções após mudanças na API: deixe a API no ar e rode `npm run generate:api`.
- Documentação da API para o front: **[docs/API-PARA-FRONTEND.md](../docs/API-PARA-FRONTEND.md)** (na raiz do monorepo).
- Swagger/OpenAPI da API: com a API rodando, acesse `{NEXT_PUBLIC_API_URL}/docs`.

---

## Estrutura principal

- `src/app/(protected)/` — Rotas protegidas (layout com sessão; redirect para `/auth` se não logado).
- `src/app/auth/` — Login (better-auth, Google).
- `src/app/_lib/` — Auth client, fetch customizado (cookies), helpers (protocols, api-errors).
- Formulários e listagens: pacientes, protocolos, avaliações estruturadas, observações não estruturadas, análise com IA.

---

## Referências

- [README principal do produto](../README.md)
- [Guia da API para o frontend](../docs/API-PARA-FRONTEND.md)
- [Next.js](https://nextjs.org/docs)
- [Orval](https://orval.dev/)
