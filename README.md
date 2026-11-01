<div align="center">

# ✅ Todo tRPC

Uma aplicação simples e moderna para gerenciamento de tarefas, construída com
**Next.js**, **React**, **tRPC**, **TanStack Query** e **Zod**.

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react" alt="React">
  <img src="https://img.shields.io/badge/tRPC-11-2596be?logo=trpc" alt="tRPC">
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript">
</p>

</div>

## ✨ Funcionalidades

- 📝 Criação de tarefas com título e descrição opcional
- ✏️ Edição de tarefas existentes
- 🗑️ Exclusão de tarefas
- ☑️ Marcação de tarefas como concluídas
- 📋 Listagem de tarefas pendentes e concluídas
- 🔔 Feedback visual através de toasts
- 🛡️ Validação de dados com Zod no backend
- ⚡ Comunicação tipada entre frontend e backend com tRPC
- 💾 Armazenamento em memória, sem banco de dados

## 🧰 Tecnologias

| Tecnologia | Uso |
| --- | --- |
| [Next.js](https://nextjs.org/) | Framework web e rotas da aplicação |
| [React](https://react.dev/) | Construção da interface |
| [tRPC](https://trpc.io/) | API tipada entre frontend e backend |
| [TanStack Query](https://tanstack.com/query) | Cache e estado assíncrono |
| [Zod](https://zod.dev/) | Validação das entradas |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização |
| [Base UI](https://base-ui.com/) | Componentes acessíveis |

## 🚀 Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm, pnpm, yarn ou bun

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Produção

```bash
npm run build
npm run start
```

### Qualidade do código

```bash
npm run lint
```

## 🗂️ Estrutura principal

```text
app/
├── api/trpc/[trpc]/route.ts   # Endpoint HTTP do tRPC
├── components/                # Componentes de tarefas e formulário
├── task/page.tsx              # Página de criação e edição
├── trpc/
│   ├── client.tsx             # Provider do tRPC no navegador
│   ├── init.ts                # Contexto e configuração do tRPC
│   └── routers/_app.ts        # Procedures e regras do CRUD
├── types/task.ts              # Tipo da tarefa
└── page.tsx                   # Página principal da listagem
```

## 🔌 Operações tRPC

O router `tasks` disponibiliza:

| Procedure | Tipo | Descrição |
| --- | --- | --- |
| `tasks.list` | Query | Retorna todas as tarefas |
| `tasks.getById` | Query | Busca uma tarefa pelo identificador |
| `tasks.create` | Mutation | Cria uma nova tarefa |
| `tasks.update` | Mutation | Atualiza título e descrição |
| `tasks.toggle` | Mutation | Altera o status de conclusão |
| `tasks.delete` | Mutation | Remove uma tarefa |

## 💾 Armazenamento

As tarefas são mantidas na variável `tasksList`, dentro do router tRPC. Essa
abordagem atende ao objetivo de manter os dados em memória e não exige banco de
dados.

> ⚠️ Como os dados ficam apenas na memória do processo, eles são perdidos quando
> o servidor é reiniciado. Em ambientes serverless, diferentes instâncias
> também podem possuir listas independentes.

## 🧪 Modelo da tarefa

Atualmente, cada tarefa possui:

```ts
type Task = {
  id: string
  title: string
  description?: string
  created_at: string
  completed: boolean
}
```
