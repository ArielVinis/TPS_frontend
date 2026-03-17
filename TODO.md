# TODO — Frontend TPS.AI

Tarefas do front-end alinhadas ao [guia da API](../docs/API-PARA-FRONTEND.md) e ao [planejamento do produto](../README.md).  
Ordem sugerida: ambiente e auth → layout e navegação → fluxos por recurso (pacientes → avaliações/observações → IA).

---

## Configuração e ambiente

- [x] Configurar variável de ambiente da base URL da API (ex.: `NEXT_PUBLIC_API_URL`, ex.: `http://localhost:8080`)
- [x] Cliente API gerado com **Orval** a partir do OpenAPI da API (`GET /swagger.json`). Config em `orval.config.ts`; mutator em `src/app/_lib/fetch.ts` (envia cookies, `credentials: 'include'`).
- [x] Com a API rodando, executar `npm run generate:api` para (re)gerar tipos e funções em `src/app/_lib/api/fetch-generated/index.ts`. Usar essas funções para chamadas à API. _(Se der erro `Cannot find module 'ajv/dist/core'`, tentar `npm install` ou corrigir dependências do Orval.)_
- [ ] (Opcional) Tratar 401/429/502 no mutator ou em wrappers.

---

## Autenticação (better-auth)

**Já implementado:** better-auth em `src/app/_lib/auth-client.ts` (baseURL da API); login com Google em `auth/_components/sign-in-with-google.tsx`; sign-out em `profile/_components/logout-button.tsx`; verificação de sessão com `authClient.getSession()` (server, com `headers()`); redirect para `/auth` quando não há sessão; redirect para `/` quando já logado na página de auth; dados do user (name, image) usados na home e no perfil; perfil com avatar, nome e botão Sair.

- [x] Integrar better-auth no projeto (login com Google, sign-out, sessão via cookie)
- [x] Verificação de sessão ao carregar: hoje via `authClient.getSession()`; páginas protegidas redirecionam para `/auth` se `!session.data?.user`
- [x] Se não logado: redirecionar para `/auth`
- [x] Se logado: dados do profissional (session.data.user) usados no app; acesso permitido
- [x] Tela de perfil com dados do usuário e opção de logout
- [ ] **(Opcional)** Chamar `GET /me` (API) no carregamento para validar sessão contra a API e obter dados do profissional de forma unificada (ex.: usar `getMe()` do fetch-generated; se 401 → redirect `/auth`)
- [ ] Garantir `NEXT_PUBLIC_API_URL` no `.env` para o `callbackURL` do login com Google (sign-in usa hoje essa variável)
- [x] **(Refino)** Ajustar textos da página `/auth` e metadata do layout para contexto TPS.AI (Terapia Ocupacional), não treinos

---

## Layout e navegação

- [x] Definir estrutura de rotas: `/` redireciona (logado → `/patients`, não logado → `/auth`); `/patients` (lista); `/patients/[id]` (detalhe); `/profile` (perfil + sair). Rotas aninhadas (ex.: `/patients/[id]/assessments`) podem ser adicionadas depois.
- [x] Layout principal com navegação: grupo `(protected)` com header (logo TPS.AI, link Pacientes, link Perfil, botão Sair) em `src/app/(protected)/layout.tsx`.
- [x] Proteção de rotas: layout `(protected)` chama `authClient.getSession()` e redireciona para `/auth` se não houver sessão; todas as rotas sob `(protected)` ficam protegidas.

---

## Pacientes

- [x] Tela de listagem: `GET /patients` via `listPatients()`; opcional `activeOnly` nos params
- [x] Exibir lista de pacientes (nome, status ativo/inativo, observações, data de cadastro); card clicável para detalhe
- [x] Tela de cadastro: `/patients/new` com formulário (nome obrigatório, observações opcional) → server action chama `createPatient`
- [x] Em sucesso (201): redirecionar para `/patients/:patientId`
- [x] Tela de detalhe do paciente: `GET /patients/:patientId` via `getPatient(id)`; exibe dados e `not-found` se 404
- [x] Edição do paciente: formulário na própria página de detalhe; server action `updatePatientAction` chama `PATCH /patients/:patientId` (nome, notes, isActive)

---

## Protocolos (uso em formulários)

- [x] Carregar protocolos onde necessário: `GET /protocols` (ex.: seletor em “Nova avaliação”)
- [x] Tela de consulta em `/protocols` e seletor reutilizável para formulários (ver `_lib/protocols.ts` e `_components/protocol-select.tsx`).

---

## Avaliações estruturadas

- [x] Na tela do paciente: listar avaliações com `listStructuredAssessments`; seção + botão Nova avaliação
- [x] Botão “Nova avaliação”; formulário: protocolo (ProtocolSelect), data, payload (textarea JSON); POST via createAssessmentAction
- [x] Em 201 redireciona para detalhe da avaliação
- [x] Lista com protocolName e data; link para detalhe/edição
- [x] Detalhe/edição: `getStructuredAssessment` + formulário PATCH (payload, assessedAt); not-found se 404

---

## Observações não estruturadas

- [x] Na tela do paciente: listar observações com `listUnstructuredObservations`; seção + botão Nova observação
- [x] Botão “Nova observação”; formulário: conteúdo (texto), data, tags (opcional)
- [x] Nova observação: form conteúdo, data, tags; POST via `createObservationAction`; em 201 redireciona para detalhe
- [x] Lista com trecho do conteúdo, data e tags; link para detalhe. Detalhe/edição: `getUnstructuredObservation` + form PATCH (content, observedAt, tags); not-found se 404

---

## Análise com IA

- [x] Na tela do paciente: botão “Gerar análise com IA”
- [x] Página /patients/[id]/ai-responses/generate com seleção opcional de avaliações e observações
- [x] generateAiAnalysisAction chama POST .../ai-responses/generate (body vazio ou com IDs)
- [x] Em 201: redireciona para detalhe; página exibe hipóteses, atividades e escalas (parse de activitiesJson/scalesJson em AiResponseContent)
- [x] Tratar 429: exibir “Aguarde X segundos” (usar header `Retry-After` se disponível)
- [x] Tratar 502: mensagem “IA temporariamente indisponível”
- [x] Histórico: listAiResponses na tela do paciente; link para /patients/[id]/ai-responses/[aiResponseId] com exibição completa

---

## Tratamento de erros e UX

- [x] 401: redirecionar para login (já coberto em Autenticação)
- [x] 404: mensagem “Recurso não encontrado” (e/ou voltar à lista)
- [x] 429: form gerar análise exibe mensagem + Retry-After
- [x] 502: form gerar análise exibe IA indisponível
- [x] 400: formatValidationError em _lib/api-errors.ts; usado em createPatientAction
- [x] Loading: isPending em formulários (Salvando…, Gerando…)

---

## Documentação e referência

- [x] README: descrição TPS.AI, env, como rodar, link para API e docs
- [x] Tipos OpenAPI: Orval (npm run generate:api)

---

_Baseado no [API-PARA-FRONTEND.md](../docs/API-PARA-FRONTEND.md) e no [README principal](../README.md). API em `TPS_api`._
