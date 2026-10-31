'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from './trpc/client'
import { TRPCClientErrorLike } from '@trpc/client'
import { AppRouter } from './trpc/routers/_app'
import { boolean } from 'zod'

// 1. Declaração da interface Task para o TypeScript reconhecer as propriedades
interface Task {
   id: string;
   title: string;
   description?: string;
   created_at: string;
   completed: boolean;
}

export default function Home() {
   const trpc = useTRPC()
   const queryClient = useQueryClient()

   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')

   const { data, isLoading, error } = useQuery(
      trpc.tasks.list.queryOptions()
   )

   // CORREÇÃO DE TIPAGEM: Adicionado parênteses para o "as Task[]" funcionar corretamente
   const list = (data ?? []) as Task[];

   const handleCreate = useMutation(
      trpc.tasks.create.mutationOptions({
         onSuccess: () => {
            setTitle('')
            setDescription('')

            // Reload tasks
            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.log(error.message)
         }
      })
   )

   const handleUpdate = () => { }

   const handleToggle = useMutation(
      trpc.tasks.toggle.mutationOptions({
         onSuccess: () => {
            // Recarrega a lista de tarefas automaticamente na tela
            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.error(error.message)
         }
      })
   )

   const handleDelete = useMutation(
      trpc.tasks.delete.mutationOptions({
         onSuccess: () => {
            // Recarrega a lista de tarefas automaticamente na tela
            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.error(error.message)
         }
      })
   )


   // CORREÇÃO DOS HOOKS: Condicionais movidas para DEPOIS de todas as declarações de useMutation
   if (isLoading) return <p className="py-8 text-center text-slate-500">Carregando tarefas...</p>

   return (
      <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
         <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <header className="mb-8">
               <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  CRUD com tRPC
               </p>
               <h1 className="mt-2 text-3xl font-bold">Minhas tarefas</h1>

               <p className="mt-2 text-slate-600">
                  {list.length === 1 ? '1 tarefa pendente' : `${list.length} tarefas pendentes`}
               </p>
            </header>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
               <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Título da tarefa (obrigatório)"
                  maxLength={200}
                  required
               />

               <textarea
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Descrição (opcional)"
                  maxLength={1000}
                  rows={2}
               />

               <button
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  type="submit"
                  disabled={handleCreate.isPending || !title.trim()}
                  onClick={() => handleCreate.mutate({ title, description: description || undefined })}
               >
                  {handleCreate.isPending ? 'Criando...' : 'Criar tarefa'}
               </button>
            </form>

            {error && (
               <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error.message}
               </p>
            )}

            <div className="mt-8">
               {list.length === 0 ? (
                  <p className="py-8 text-center text-slate-500">Nenhuma tarefa cadastrada.</p>
               ) : (
                  <ul className="space-y-3">
                     {list.map(task => (
                        <li className="rounded-lg border border-slate-200 p-4 bg-slate-50" key={task.id}>
                           <div className="flex items-start gap-3">
                              <input
                                 className="mt-1 h-5 w-5 accent-blue-600"
                                 type="checkbox"
                                 checked={task.completed}
                                 onChange={() => handleToggle.mutate({ id: task.id, completed: !task.completed })}
                              />

                              <div className="min-w-0 flex-1">
                                 <p className={task.completed ? 'line-through text-slate-400' : 'font-semibold'}>
                                    {task.title}
                                 </p>

                                 {task.description && (
                                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                                 )}

                                 <p className="mt-2 text-xs text-slate-400">
                                    Criada em {new Date(task.created_at).toLocaleString('pt-BR')}
                                 </p>
                              </div>

                              <button
                                 className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                 type="button"
                              // onClick={() => startEditing(task)}
                              >
                                 Editar
                              </button>

                              <button
                                 className={`text-sm font-medium text-red-600 hover:text-red-800 `}
                                 disabled={task.id === '1'}
                                 onClick={() => handleDelete.mutate({ id: task.id })}
                              >
                                 Deletar
                              </button>
                           </div>
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </section>
      </main>
   )
}
