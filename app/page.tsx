'use client'

import { useQuery } from '@tanstack/react-query'
import { useTRPC } from './trpc/client'
import { TaskItem } from './components/taskItem'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Home() {
   const trpc = useTRPC()

   const { data, isLoading, error } = useQuery(
      trpc.tasks.list.queryOptions()
   )

   const router = useRouter()

   const list = (data ?? []) as Task[]

   const pendingTasks = list.filter(t => t.completed === false)

   if (isLoading) return <p className="py-8 text-center text-slate-500">Carregando tarefas...</p>

   return (
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
                        <TaskItem task={task} key={task.id} />
                     ))}
                  </ul>
               )}
            </div>
         </section>
      </main>
   )
}
