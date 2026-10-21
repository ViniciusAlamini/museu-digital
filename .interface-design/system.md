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