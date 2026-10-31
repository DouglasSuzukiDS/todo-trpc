'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from './trpc/client'
import { TRPCClientErrorLike } from '@trpc/client'
import { AppRouter } from './trpc/routers/_app'

export default function Home() {
   const trpc = useTRPC()
   const queryClient = useQueryClient()

   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')

   const { data: tasks = [] as Task[], isLoading, error } = useQuery(
      trpc.tasks.tasks_list.queryOptions()
   )

   if (isLoading) return <p>Carregando tarefas...</p>

   if (error) return <p>Ocorreu um erro: {error.message}</p>

   const handleCreate = useMutation(
      trpc.tasks.create.mutationOptions({
         onSuccess: () => {
            setTitle('')
            setDescription('')

            // Reload tasks
            queryClient.invalidateQueries(trpc.tasks.tasks_list.pathFilter())

         },

         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.log(error.message)
         }
      })
   )

   const handleUpdate = () => {

   }

   const handleToogle = () => {

   }

   const handleDelete = () => {

   }

   return (
      <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
         <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <header className="mb-8">
               <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  CRUD com tRPC
               </p>
               <h1 className="mt-2 text-3xl font-bold">Minhas tarefas</h1>

               <p className="mt-2 text-slate-600">
                  {tasks && tasks.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
               </p>
            </header>

            <form className="space-y-3" onSubmit={handleCreate}>
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
               >
                  Criar tarefa
               </button>
            </form>

            {error && (
               <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
               </p>
            )}

            <div className="mt-8">
               {isLoading ? (
                  <p className="py-8 text-center text-slate-500">Carregando tarefas...</p>
               ) : tasks.length === 0 ? (
                  <p className="py-8 text-center text-slate-500">Nenhuma tarefa cadastrada.</p>
               ) : (
                  <ul className="space-y-3">
                     {tasks && tasks.map((task) => (
                        <li className="rounded-lg border border-slate-200 p-4" key={task.id}>
                           {editingId === task.id ? (
                              <form className="space-y-3" onSubmit={handleUpdate}>
                                 <input
                                    className="w-full rounded border border-slate-300 px-3 py-2"
                                    value={editTitulo}
                                    onChange={(event) => setEditTitulo(event.target.value)}
                                    maxLength={200}
                                    required
                                 />
                                 <textarea
                                    className="w-full rounded border border-slate-300 px-3 py-2"
                                    value={editDescricao}
                                    onChange={(event) => setEditDescricao(event.target.value)}
                                    maxLength={1000}
                                    rows={2}
                                 />
                                 <div className="flex gap-3">
                                    <button className="font-medium text-blue-600" type="submit">
                                       Salvar
                                    </button>
                                    <button
                                       className="font-medium text-slate-500"
                                       type="button"
                                       onClick={() => setEditingId(null)}
                                    >
                                       Cancelar
                                    </button>
                                 </div>
                              </form>
                           ) : (
                              <div className="flex items-start gap-3">
                                 <input
                                    className="mt-1 h-5 w-5 accent-blue-600"
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask.mutate({ id: task.id })}
                                 />
                                 <div className="min-w-0 flex-1">
                                    <p className={task.completed ? 'line-through text-slate-400' : 'font-semibold'}>
                                       {task.titulo}
                                    </p>
                                    {task.descricao && (
                                       <p className="mt-1 text-sm text-slate-600">{task.descricao}</p>
                                    )}
                                    <p className="mt-2 text-xs text-slate-400">
                                       Criada em {new Date(task.dataCriacao).toLocaleString('pt-BR')}
                                    </p>
                                 </div>
                                 <button
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    type="button"
                                    onClick={() => startEditing(task)}
                                 >
                                    Editar
                                 </button>
                                 <button
                                    className="text-sm font-medium text-red-600 hover:text-red-800"
                                    type="button"
                                    onClick={() => deleteTask.mutate({ id: task.id })}
                                 >
                                    Deletar
                                 </button>
                              </div>
                           )}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </section>
      </main>
   )
}
