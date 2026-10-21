# Museu Digital — Arquivo medieval

Referência de método: https://github.com/Dammyjay93/interface-design

## Intenção
Biblioteca pessoal de aventuras de RPG. Reencontrar e registrar campanhas, personagens, artes, crônicas, correspondências e diários. Aparência medieval, com conforto de leitura e uso integral pelo celular.

## Direção
Fólios de um códice: número de catálogo, versaletes, títulos serifados e legendas de autoria/data. Pergaminho claro, tinta castanha, vinho e latão envelhecido. Medieval por tipografia, composição e marcas de catálogo.

## Tokens
- Base 4 px; escala 4/8/12/16/24/32/48/64.
- `--parchment: #eee7d8`, `--paper: #faf6ed`, `--inset: #e8dfce`.
- `--ink: #302c25`, `--ink-secondary: #6e6558`, `--ink-muted: #706557`.
- `--wine: #793d34`, `--wine-hover: #613027`, `--brass: #80622f`, `--moss: #53674c`. Metadados e latão escurecidos para contraste AA no pergaminho.
- Regras finas em tinta com baixa opacidade. Profundidade por tom de papel e sombra discreta; raio 4–8 px.
- Cabeçalhos: Cormorant Garamond local, Georgia fallback. Controles: Manrope local, sans-serif fallback.
- Texto de interface 14 px; títulos 24/32/44/56; leitura 17–18 px, entrelinha 1.75.

## Padrões
- Sidebar 232 px no desktop; dialog de navegação no celular, cabeçalho de 64 px.
- `btn`: altura mínima 44 px, padding 12/16, raio 4 px, 13 px/600. Vinho indica ação principal.
- `field`: altura mínima 44 px, papel rebaixado, borda sutil, foco vinho e rótulo associado.
- `paper`: folha clara, regra sutil e padding responsivo 20–32 px.
- Imagens em molduras de catálogo; falha vira ex-libris ou ficha de iniciais sem mudar o registro salvo.
- Ações acessíveis sem hover. Foco visível, Escape e retorno de foco nos dialogs; reduced-motion.
- Celular: uma coluna, botões permitem quebra de linha, listas e ferramentas de pastas adaptam-se à largura.

## Focos visuais
Início: volumes das campanhas. Campanha: folha de rosto. Personagens: retratos e nomes. Obras: imagem e legenda. Diário/posts: título e texto. Formulários: conteúdo e ação salvar.

## Campaign variation: Curse of Strahd
When the active campaign name contains "Strahd", the app shell uses charcoal, candlelit paper, bone ink, ruby, and aged bronze tokens. The campaign opening receives a dark red image wash; selected navigation and primary actions use ruby with light text. Other campaigns retain the medieval parchment palette. The variant applies to all routes and the mobile menu.
## Campaign variation: Icewind Dale
When the active campaign name contains "Icewind", the app shell switches to glacier blue, snow, and slate tokens, with Cinzel display titles. A fine, slow snowfall passes over the page and pauses for reduced-motion preferences. Missing campaign art uses a cold slate fallback. Other campaigns retain their current theme.

## Biblioteca: galeria de volumes grandes
A biblioteca usa madeira escura, marfim e dourado envelhecido. A navegação mantém esse acabamento nas campanhas; cada mundo conserva a própria paleta nas páginas de conteúdo. Capas verticais 2:3, até 390 px de largura, com lombada, borda de páginas e cantoneiras. Duas colunas no desktop e uma no celular. Título em HTML sobre a arte, metadados reais na legenda, foco de teclado e movimento reduzido. Implementação em `src/app/library.css`.

Primeira capa ilustrada: Maldição de Strahd, pintura gótica criada a partir da referência enviada pelo usuário. Arte otimizada em `public/covers/strahd-painted-v1.webp`; a campanha local foi atualizada para esse caminho. Referência anterior: `/uploads/campaigns/1787365587090-pmh2uvvumzo.jpg` (arquivo ausente).

Capa de Icewind: pintura glacial inspirada na referência enviada pelo usuário, com a figura de coruja com chifres, olhos luminosos, nevasca e um aventureiro em primeiro plano. Arte otimizada em `public/covers/icewind-painted-v1.webp`, aplicada à campanha local. Referência anterior: `/uploads/campaigns/1787364517666-4atk0r9c1c2.jpg` (arquivo ausente). Acabamento azul e prata, título em Cinzel; símbolo de floco permanece disponível quando a arte não carrega.

## Abertura de aventura
A página inicial da campanha mostra a capa inteira em proporção 2:3 (`object-fit: contain`), ao lado de título, sistema, data e ações de explorar/escrever no diário. No celular, capa e título ficam empilhados. A apresentação vem antes do índice de cinco seções, com contagens reais. A navegação em abas fica nas subpáginas, evitando duplicação no início. Editar/excluir ficam no disclosure nativo “Gerenciar campanha”. Registros recentes exibem a data acima do título no celular.

## Feed da biblioteca
O início mostra as 12 atividades mais recentes de todas as campanhas, com quatro visíveis e as demais no disclosure nativo “Ver mais atividades”. No desktop amplo, o feed ocupa uma coluna de 300 px ao lado dos livros; em telas menores, aparece acima deles. Cada evento traz pessoa, ação, título, campanha e horário de São Paulo. Reutiliza AuditLog, compatível com os nomes antigos de tipos e ações, sem migração. Novos registros salvam o link em details e invalidam a página inicial. Links de registros já removidos voltam à seção correspondente. Estado vazio sem eventos fictícios.

## Materiais de cada campanha
`src/app/campaign-realms.css` aplica os acabamentos de cada mundo em todas as seções: contexto de capítulo com brasão, cabeçalhos com motivo, botões, fichas, histórias, mensagens, pastas, editor, campos e diálogos. Icewind usa prata, azul glacial e flocos; Strahd usa bronze, vinho e morcegos. Botões principais têm acabamento em relevo e motivo decorativo; rótulos e ícones das ações são preservados. Navegação acompanha o mundo atual. Foco, erros, desabilitado e movimento reduzido mantêm seus estados. No celular, salvar e cancelar ficam em linhas separadas. A página inicial da biblioteca mantém sua identidade própria.
