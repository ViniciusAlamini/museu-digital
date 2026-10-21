# Medieval Museum Implementation Plan

> **For agentic workers:** Use executing-plans for the main implementation and dispatching-parallel-agents for independent form/explorer tasks after the shared component contract exists.

**Goal:** Refazer toda a interface como arquivo medieval, com uso de celular como requisito central.
**Architecture:** Shell responsivo compartilhado, tokens de pergaminho e componentes editoriais; consultas e ações de servidor existentes são conservadas. Galerias e formulários consomem as mesmas primitivas e tokens.
**Tech Stack:** Next 16.3.2, React 19, Tailwind 4, TypeScript, Prisma SQLite, Tiptap.
**Spec:** `docs/superpowers/specs/2026-10-21-medieval-redesign-design.md`

## Global Constraints

- Mobile-first, conferir 390 px e 1440 px; alvos de toque de 44 px; menu acessível.
- Nenhum reset, migração destrutiva, alteração de URLs ou perda de registros.
- Conservar correções anteriores de dependências e remotePatterns.
- Sem novos módulos de autenticação/Drive; sem dados ou ações decorativas falsas.
- Fonte local, fallback de imagens, estados vazios, envio, erro e carregamento.
- Trabalhar no workspace compartilhado em que o usuário acompanha o servidor; não mover banco ou arquivos locais para um checkout diferente.

## Review Focus

1. Imagens locais ausentes e Google com falha: fallback não estoura o layout.
2. Nomes longos e celular estreito: quebra de linha e ausência de overflow.
3. Pastas aninhadas no celular: entrar, subir e criar preservam URL/parâmetros.
4. Menu e exclusão: teclado, Escape, foco, botões de toque e erro de envio.
5. Busca sem resultado e formulário inválido: feedback útil sem alterar dados.

## Tasks

### 1. Tokens, fontes e primitivas
- [x] Criar `.interface-design/system.md`, renovar `globals.css`, baixar fontes e respectivas licenças para `src/app/fonts`.
- [x] Criar `shared/ArchiveImage.tsx`, `ArchiveMark.tsx`, `PageHeader.tsx`, `EmptyState.tsx`, `RichContent.tsx`.
- [x] Contrato CSS: `btn`/`btn-primary`/`btn-secondary`/`btn-danger`/`btn-ghost`, `field`, `field-label`, `field-error`, `paper`, `eyebrow`, `page-header`, `folio-number`; cores `--parchment`, `--paper`, `--ink`, `--ink-secondary`, `--ink-muted`, `--wine`, `--brass`, `--rule`. Aliases antigos preservam temporariamente páginas durante a conversão.
- [x] Verificar fontes locais e fallback visual de imagem antes da integração.

### 2. Shell e acervo
- [x] Root layout consulta id/nome/sistema das campanhas e passa para `AppShell({campaigns, children})`.
- [x] Shell inclui navegação desktop e dialog móvel nativo; links ativos e breadcrumbs reais.
- [x] Renovar home e `CampaignCard`; `CampaignCollection` faz busca, filtro e ordenação reais.
- [x] Conferir navegação mobile e ausência de overflow.

### 3. Formulários e diálogos (tarefa independente)
- [x] Renovar `*Form.tsx`, `ImageUpload.tsx` e `DeleteDialog.tsx`; CSS próprio `forms.css` pode ser importado pelos componentes ou por globals.
- [x] Preservar validações e ações, adicionar rótulos associados e feedback acessível de erro/envio.
- [x] Diálogo de confirmação usa `<dialog>` com foco nativo, cancelamento e erros. Não alterar ações de servidor.
- [x] Conferir envio inválido e acessibilidade no celular sem criar/apagar registros existentes.

### 4. Exploradores de diário e desenhos (tarefa independente)
- [x] Refazer `DiaryExplorer.tsx`, `ArtworkExplorer.tsx` e, se útil, `shared/FolderExplorer.tsx`; CSS próprio `explorer.css`.
- [x] Índice lateral desktop e navegação móvel acessível, trilha dos ancestrais, vazio e ações contextualizadas.
- [x] Preservar nomes de parâmetros (`folderId` diário, `folder` desenhos; `parentId`, `folderId` na criação).
- [x] Conferir pastas aninhadas, raiz, pastas inexistentes e largura de 390 px.

### 5. Campanhas, galerias e detalhes
- [x] Refazer layout da campanha e visão geral, cards de personagens/obras/posts/mensagens, títulos e estados vazios das listagens.
- [x] Converter detalhes e wrappers de criar/editar para folhas de catálogo; adotar ArchiveImage e RichContent.
- [x] Atualizar not-found, error (API `retry` nesta versão) e loading.
- [x] Cada rota deve usar os tokens e ações compartilhadas.

### 6. Integração e entrega
- [x] Typecheck, lint e build. Corrigir falhas introduzidas e reportar as demais com precisão.
- [x] Inspeção de navegador em 1440 e 390 px: início, campanha, personagens, artes, diário, leitura e formulário.
- [x] Interações: busca, filtros, menu, Escape, pastas, validação, imagens ausentes.
- [x] Revisão independente final de código e layout; corrigir achados importantes.
- [x] Servidor local iniciado; relatar resultado e limitações sem confundir a falta dos arquivos originais com o redesenho.

## Progress / rulings

- Direção aprovada com a orientação adicional de uso pelo celular; executar continuamente sem novas confirmações de estilo.
- Não criar testes unitários que espelham CSS; usar verificações de tipo, lint, build e interação real de navegador para este redesenho.
- Preservar alterações anteriores do workspace; não criar commits ou publicar automaticamente.

## Delivery verification (2026-10-21)

- Production build and TypeScript passed; ESLint: zero errors, three existing backend warnings.
- Browser inspection covered 27 routes on desktop and mobile; additional widths: 320, 360 and 768 px. No horizontal overflow.
- Search, sorting, menu focus/Escape, nested folders, validation, upload failure and unavailable images checked.
- Temporary campaign CRUD, post editing/deletion and folder creation passed through the mobile interface.
- Hash comparison of all SQLite table data confirmed original records were preserved after cleanup.
- Independent final code review completed; selected folder handling and editor image dragging corrected.
- Local development server available at http://localhost:3000. Original missing image files still require restoration or re-upload.
