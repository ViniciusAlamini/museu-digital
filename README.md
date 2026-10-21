# 🐉 Acervo de Campanhas de RPG (Museu Digital)

Uma aplicação web full-stack desenvolvida para organizar, documentar e imortalizar suas campanhas de RPG de mesa. 

Este projeto funciona como um grande "arquivo digital", permitindo que o Mestre e os Jogadores registrem personagens, guardem artes, escrevam crônicas em um diário hierárquico e troquem mensagens como se fossem seus próprios personagens.

---

## ✨ Funcionalidades

- **📚 Gestão de Campanhas:** Crie campanhas com capas personalizadas, sistema de RPG, datas e descrições. Exclusão em cascata garante a limpeza dos dados.
- **🧙‍♂️ Personagens:** Cadastro de personagens (jogadores ou NPCs) com retratos, raça, classe e informações detalhadas.
- **🎨 Galeria de Desenhos:** Um espaço dedicado para salvar mapas, retratos e artes inspiracionais da aventura.
- **📰 Posts e Crônicas:** Feed de postagens utilizando um editor de texto rico (Tiptap) para registrar resumos de sessões e contos.
- **💬 Mural de Mensagens:** Um feed interativo onde jogadores podem deixar recados, pensamentos de seus personagens ou mensagens para o grupo.
- **📖 Diário Avançado:** Sistema semelhante a um explorador de arquivos de computador. Crie pastas aninhadas (ex: `Capítulo 1 > Cena 2`) e escreva entradas de diário com textos ricos e imagens mescladas aos parágrafos.
- **📤 Upload de Imagens:** Suporte a upload local com recurso de *drag-and-drop*, sem depender de serviços externos.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)** (App Router)
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** (Arquivo medieval em pergaminho, responsivo para computador e celular)
- **[Prisma ORM 7](https://www.prisma.io/)**
- **SQLite** (`better-sqlite3`) para um banco de dados local ultra rápido e sem necessidade de infraestrutura extra.
- **[Tiptap](https://tiptap.dev/)** (Editor de texto rico para o Diário e Posts)
- **React Hook Form + Zod** (Validação de formulários)
- **Lucide React** (Ícones)

---

## 🚀 Como Rodar o Projeto (Localmente)

Siga os passos abaixo para baixar e rodar o acervo no seu próprio computador.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (22.12 ou superior na linha 22; instalação atual: 22.23.2)
- [Git](https://git-scm.com/)

### Instalação

**1. Clone o repositório**
```bash
git clone https://github.com/ViniciusAlamini/museu-digital.git
cd museu-digital
```

**2. Instale as dependências**
```bash
npm install
```

**3. Prepare o Banco de Dados**
O projeto usa SQLite local. Para uma instalação nova, gere o cliente Prisma e aplique as migrações:
```bash
npm run db:generate
npm run db:migrate
```

Se você já tem um banco com campanhas, preserve uma cópia de `prisma/dev.db` antes de alterar o esquema. Não aceite operações de reset ou perda de dados para iniciar um acervo existente.

**4. Inicie o servidor**
```bash
npm run dev
```

Acesse **[http://localhost:3000](http://localhost:3000)** no seu navegador. O acervo já estará pronto para uso!

---

## 📂 Estrutura e Dados (Importante)

Para manter o projeto seguro e não sobrecarregar o controle de versão, **o banco de dados e as imagens cadastradas não sobem para o GitHub**. 
Eles ficam armazenados localmente nestes dois caminhos:
- Banco de Dados: `prisma/dev.db`
- Imagens: `public/uploads/`

Não existe sincronização automática com o Google Drive. Imagens cadastradas por URL dependem da disponibilidade e da permissão do endereço original. Arquivos locais ausentes precisam ser restaurados ou reenviados; a interface exibe uma capa alternativa nesses casos.

## Interface

A direção visual e os componentes compartilhados estão documentados em [`.interface-design/system.md`](.interface-design/system.md). As fontes são locais, com licenças em `src/app/fonts/`. Menu, galerias, editor e formulários se adaptam ao celular.

> **Dica de Backup:** Se você for formatar o PC ou trocar de computador, basta copiar a pasta `public/uploads/` e o arquivo `prisma/dev.db` para um pen drive e colá-los no PC novo após fazer a instalação. Todas as suas campanhas continuarão exatamente de onde você parou!

---

## 📜 Licença
Projeto criado para uso pessoal e organização de aventuras épicas. Sinta-se livre para clonar e modificar para a sua própria mesa de RPG!


## Login, cadastro e auditoria

Depois de preparar as tabelas do banco, configure a chave de sess?o e a compatibilidade das contas antigas com:

```bash
npm run db:auth-setup
npm run db:generate
```

O comando cria `.env.local` com uma chave aleatória local e adiciona a função de usuário sem apagar contas ou eventos de auditoria. Defina `INVITE_CODE` nesse arquivo e compartilhe o código apenas com os jogadores. O primeiro cadastro que usar o convite recebe acesso de administrador; as contas antigas continuam podendo entrar com suas senhas. Campanhas e registros são compartilhados entre os usuários deste acervo.
