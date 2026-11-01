'use client'

import { Suspense, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from './trpc/client'
import { TRPCClientErrorLike } from '@trpc/client'
import { AppRouter } from './trpc/routers/_app'
import { TaskComponent } from './components/taskComponent'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

   const router = useRouter()

   // CORREÇÃO DE TIPAGEM: Adicionado parênteses para o "as Task[]" funcionar corretamente
   const list = (data ?? []) as Task[]

   const pendingTasks = list.filter(t => t.completed === false)


   if (isLoading) return <p className="py-8 text-center text-slate-500">Carregando tarefas...</p>

   return (
      <Suspense>
         <main className="min-h-screen px-4 py-12">
            <section className="mx-auto max-w-2xl rounded-2xl bg-gray-700 p-6 shadow-lg sm:p-8">
               <p className="text-sm text-center font-semibold uppercase tracking-wide text-blue-600">
                  CRUD com tRPC
               </p>

               <div className="flex justify-between items-center mb-8">
                  <div>
                     <h1 className="mt-2 text-2xl md:text-3xl font-bold">Minhas tarefas</h1>

                     <p className="mt-2 text-slate-600">
                        {pendingTasks.length === 1 ? '1 tarefa pendente' : `${pendingTasks.length} tarefas pendentes`}
                     </p>
                  </div>

                  <Button
                     onClick={() => router.push(`/task`)}>
                     Nova tarefa
                  </Button>
               </div>

               {/* <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
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
            </form> */}

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
                           <TaskComponent task={task} key={task.id} />
                        ))}
                     </ul>
                  )}
               </div>
            </section>
         </main>
      </Suspense>
   )
}
