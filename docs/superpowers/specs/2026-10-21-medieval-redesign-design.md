# Redesenho do Museu Digital — Arquivo medieval

## Pedido e direção

O usuário pediu que todo o projeto fosse refeito usando o método de interface design de https://github.com/Dammyjay93/interface-design e definiu que quer uma aparência **mais medieval**. Este documento propõe o redesenho completo da interface do aplicativo existente. As escolhas visuais específicas abaixo são propostas de implementação, ainda sujeitas à aprovação do usuário.

O museu reúne lembranças de mesas de RPG: campanhas, personagens, desenhos, posts, mensagens e diários. A pessoa chega para reencontrar uma história ou registrar algo novo. A interface deve transmitir a sensação de abrir uma biblioteca de aventuras, com organização clara e leitura confortável.

## Exploração do universo

- Território: códices, crônicas de viagem, bestiários, atlas, brasões, pergaminhos, selos, catálogos e anotações de escribas.
- Mundo de cores: pergaminho envelhecido, marfim, tinta castanha, vinho dos selos de cera, latão antigo e verde musgo.
- Assinatura: **fólios do acervo**. Cada peça aparece como uma ficha de manuscrito: número discreto, categoria em versaletes, título serifado, legenda de autoria e data. Essa linguagem atravessa navegação, campanhas, personagens, artes e páginas de leitura.
- Padrões a substituir: grades de caixas iguais dão lugar a capas grandes e fichas menores; efeitos roxos e brilhos dão lugar a vinho e latão com contraste controlado; ícones decorativos sem contexto dão lugar a marcações de catálogo, cronologia e organização por campanha.

## Sistema visual proposto

### Materiais e cores

| Token | Valor de referência | Uso |
| --- | --- | --- |
| Pergaminho | `#eee7d8` | Fundo principal e navegação |
| Folha | `#faf6ed` | Superfícies de leitura e fichas |
| Folha rebaixada | `#e8dfce` | Campos e áreas auxiliares |
| Tinta | `#302c25` | Texto principal |
| Tinta secundária | `#6e6558` | Descrições e metadados |
| Vinho | `#793d34` | Ação principal e seleção |
| Latão | `#9b783e` | Detalhes de catálogo e regras |
| Musgo | `#53674c` | Estados positivos |

A paleta é predominantemente clara e quente. O tom vinho identifica ações; o latão marca detalhes editoriais. Superfícies usam variações próximas de pergaminho. Bordas finas e sombras discretas de papel definem camadas. Evitar texturas que prejudiquem contraste e ornamentos que ocupem o espaço do conteúdo.

### Tipografia e medidas

- Títulos: Cormorant Garamond, serifada, com ênfase em maiúsculas e itálicos pontuais. Alternativa local: Georgia.
- Interface e formulários: Manrope, com alternativa sans-serif do sistema. Fontes devem ser servidas localmente quando possível, sem depender de downloads a cada inicialização do Next.
- Escala: 12 / 14 / 16 / 20 / 24 / 32 / 44 / 56 px; títulos principais responsivos. Texto de leitura 17–18 px com entrelinha de aproximadamente 1,75.
- Espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 24, 32, 48, 64.
- Controles com pelo menos 40 px de altura e ações principais com 44 px. Foco visível, contraste AA e movimento reduzido respeitado.
- Cantos de 4–8 px na interface; aparência editorial e proporções de livro nas capas.

## Estrutura e navegação

Desktop: uma barra lateral de aproximadamente 232 px, no mesmo mundo de pergaminho do conteúdo. Ela contém a marca, acesso ao acervo, lista real de campanhas e ação para criar campanha. Dentro de uma campanha, apresenta as seis seções: visão geral, personagens, desenhos, posts, mensagens e diário. A seleção e o nome da campanha ficam claros.

Área principal: cabeçalho com caminho de navegação e título contextual, seguido do conteúdo. Largura útil de cerca de 1200 px para coleções; textos longos limitados a aproximadamente 72 caracteres por linha.

Celular: marca e botão de menu no topo. A navegação abre em painel acessível com suporte a Escape, foco e fechamento. Controles e títulos se reorganizam; nenhuma ação essencial depende de hover. Listas de pastas e trilha de navegação continuam utilizáveis.

## Telas abrangidas

### 1. Acervo inicial

Cabeçalho editorial com nome do acervo e breve explicação. Contagens reais aparecem como uma linha de catálogo, sem competir com as capas. Busca por nome, sistema e descrição da campanha, filtro por sistema e ordenação funcionais. As campanhas são volumes com capa, número de catálogo, título, sistema, data e contagens de conteúdo. Grade com duas colunas amplas no desktop e uma no celular. Estado vazio orienta criar a primeira campanha.

### 2. Campanha e visão geral

Abertura como folha de rosto: título da campanha, sistema, data e imagem de capa quando disponível. Imagem ausente recebe uma composição gráfica local com símbolo e nome da campanha. A descrição é legível e os acessos às seções mostram contagens reais. Itens recentes e atalhos usam somente dados já existentes. Editar e excluir permanecem disponíveis com hierarquia apropriada.

### 3. Personagens

Lista como galeria de retratos catalogados. Nome é o ponto de entrada; jogador, raça e classe vêm em segundo plano. Retratos ausentes têm uma ficha visual deliberada com iniciais ou símbolo, sem ícone de imagem quebrada. Página do personagem organiza retrato, descrição e identificação em uma composição de biografia. Criar e editar recebem o mesmo sistema de formulários.

### 4. Desenhos e pastas

Galeria dá prioridade às obras; títulos e artista ficam na legenda. Pastas aparecem como divisões do catálogo. Árvore lateral, navegação hierárquica e ações de adicionar pasta/imagem funcionam no desktop e celular. Uma obra abre em visualização ampla com descrição, artista e data. Ações preservam o comportamento atual.

### 5. Posts e mensagens

Posts usam composição de crônicas com títulos e trechos; mensagens lembram correspondências, com autoria, personagem relacionado, tipo e data. Conteúdo é o foco. Imagens, edição e exclusão continuam disponíveis. Os estados vazios indicam qual registro pode ser criado.

### 6. Diário

Organização como um códice de registros. Pastas formam o índice; entradas exibem título, autoria e data. Navegação funciona com e sem pastas e mantém os parâmetros atuais da URL. A leitura tem largura confortável e o editor mantém suas ferramentas e conteúdo rico, com controles e estados consistentes.

### 7. Criar, editar, excluir e erros

Todos os formulários de campanha, personagem, arte, post, mensagem, pasta e diário serão atualizados. Campos compartilham medidas, rótulos, ajuda, validação, estado de envio e ações de cancelar/salvar. Formulários extensos recebem agrupamento por assunto; campos não perdem seus nomes nem validações existentes. Confirmação de exclusão deve ser acessível, com foco e tratamento de falha. Incluir apresentação consistente para página não encontrada, carregamento e erros de rota.

## Imagens e dados existentes

O banco atual inclui dados de uma versão mais ampla do produto. O redesenho deve preservar o arquivo SQLite, suas tabelas extras, os registros, URLs e os fluxos de ações existentes. Não haverá reset, `db push` com perda de dados nem migração de armazenamento como parte deste trabalho.

As imagens locais atualmente referenciadas pelo banco não estão em `public/uploads`. A interface deve lidar com falhas de carregamento e apresentar substitutos adequados ao catálogo. Isso não recupera os arquivos originais. Upload continua usando o endpoint atual. Links do Google já permitidos seguem funcionando quando o arquivo remoto está disponível. Integração e transferência para Google Drive ficam fora deste redesenho e exigem um trabalho específico.

## Implementação e limites

- Manter Next.js 16.3.2, React 19, TypeScript, Tailwind 4, Prisma/SQLite, ações de servidor, React Hook Form/Zod e Tiptap.
- Ler a documentação local de Next antes de mudanças em suas APIs. Usar componentes de servidor para dados e componentes de cliente para interação.
- Criar componentes compartilhados para botões, cabeçalhos, estados vazios, imagens com fallback, navegação, cards e formulários onde houver repetição.
- Usar controles HTML acessíveis ou primitivas existentes. Não implementar navegação e sobreposições incompletas com divs clicáveis.
- Manter rotas e parâmetros existentes. Nenhum botão de busca, filtro, troca de visualização ou ordenação será apenas decorativo.
- Conservar as correções locais de instalação (`better-sqlite3` 12.6.0) e configuração de imagens já feitas nesta sessão.
- Registrar as decisões finais em `.interface-design/system.md` para sustentar a consistência entre telas e futuras alterações.

## Verificação e critério de conclusão

1. Todas as páginas e componentes visuais do aplicativo recebem o novo sistema, incluindo formulários e detalhes.
2. Typecheck, lint e build são executados; avisos anteriores são distinguidos de problemas introduzidos.
3. Conferir visualmente início, campanha, personagens, galeria, diário, leitura e formulário em larguras desktop e celular com navegador/screenshot quando disponível.
4. Conferir busca/filtros, navegação entre campanhas/seções, parâmetros de pastas, imagem que falha e envio/validação de formulário sem apagar registros existentes.
5. Nenhuma imagem ausente pode quebrar o layout; nenhuma tela deve exigir rolagem horizontal em 390 px por um erro de composição.
6. Entregar o aplicativo em execução local e relatar alterações, verificações e qualquer limitação observada.

## Decisões deixadas ao implementador

O implementador pode ajustar valores próximos da paleta, ícones, detalhes de marca e arranjos responsivos para melhorar o resultado. O escopo de funcionalidades atuais e a integridade dos dados são obrigatórios. Não é necessário acrescentar autenticação, NPCs, comentários ou módulos de versões antigas do banco.
