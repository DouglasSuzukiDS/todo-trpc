import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/toast"
import { TRPCClientErrorLike } from "@trpc/client"
import { AppRouter } from "../trpc/routers/_app"
import { Button } from "@/components/ui/button"
import { useTRPC } from "../trpc/client"
import { useRouter } from "next/navigation"

type Props = {
   task: Task
}

export const TaskItem = ({ task }: Props) => {
   const trpc = useTRPC()
   const queryClient = useQueryClient()
   const router = useRouter()

   const handleToggle = useMutation(
      trpc.tasks.toggle.mutationOptions({
         onSuccess: (data) => {
            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())

            return toast.add({
               type: 'success',
               description: 'Tarefa deletada com sucesso.'
            })
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.error(error.message)
         }
      })
   )

   const handleDelete = useMutation(
      trpc.tasks.delete.mutationOptions({
         onSuccess: (data) => {
            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())

            return toast.add({
               type: 'success',
               description: 'Tarefa deletada com sucesso.'
            })
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.error(error.message)
         }
      })
   )

   return (
      <li className="rounded-lg border border-slate-200 p-4 bg-slate-50" key={task.id}>
         <div className="flex flex-col md:flex-row">
            <div className="flex gap-6 flex-1">
               <input
                  className="mt-1 h-5 w-5 accent-blue-600"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle.mutate({ id: task.id, completed: !task.completed })}
               />


               <div className="flex flex-col">
                  <p className={`text-black ${task.completed ? 'line-through text-slate-400' : 'font-semibold'}`}>
                     {task.title}
                  </p>

                  {task.description && (
                     <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                     Criada em {new Date(task.created_at).toLocaleString('pt-BR')}
                  </p>
               </div>
            </div>

            <div className="w-full flex justify-center items-center mt-4 md:w-auto md:justify-end md:mt-0">
               <Button
                  className="text-sm font-bold text-blue-600 hover:text-blue-800"
                  variant={"ghost"}
                  onClick={() => router.push(`/task?id=${task.id}`)}>
                  Editar</Button>

               <Button
                  variant={'outline'}
                  disabled={task.id === '1'}
                  className={`text-sm font-bold text-red-600 hover:text-red-800 `}
                  onClick={() => handleDelete.mutate({ id: task.id })}>
                  Deletar</Button>
            </div>
         </div>
      </li>
   )
}