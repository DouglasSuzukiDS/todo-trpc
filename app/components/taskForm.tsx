'use client'

import { Button } from "@/components/ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTRPC } from "../trpc/client"
import { TRPCClientErrorLike } from "@trpc/client"
import { AppRouter } from "../trpc/routers/_app"
import { toast } from "@/components/ui/toast"
import { AlertDialogComponent } from "./alertDialog"

export const TaskForm = () => {
   const [task, setTask] = useState<Partial<Task>>({ title: '', description: '' })

   const trpc = useTRPC()
   const queryClient = useQueryClient()

   const router = useRouter()
   const pathName = usePathname()
   const searchParams = useSearchParams()
   const taskId = searchParams.get('id')

   const { data: taskItem, isLoading } = useQuery(
      trpc.tasks.getById.queryOptions(
         { id: taskId! },
         { enabled: !!taskId }
      )
   ) as { data: Task }

   const alertDialogContent = {
      triggerText: "Cancelar",
      titleText: "Você tem certeza absoluta?",
      descriptionText: taskId ?
         "Suas alterações não salvas serão perdidas. Deseja voltar para a página inicial?" :
         'Deseja sair sem adicionar uma nova tarefa ?',
      cancelBtnText: taskId ?
         "Continuar editando" : 'Quero registar',
      confirmBtnText: "Voltar à home",
      confirmBtnAction: () => router.push('/')
   }

   const handleCreate = useMutation(
      trpc.tasks.create.mutationOptions({
         onSuccess: () => {
            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())

            return toast.add({
               type: 'success',
               description: 'Tarefa registrada.'
            })
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.log(error.message)

            return toast.add({
               type: 'error',
               description: 'O titulo da tarefa e obrigatorio.'
            })
         }
      })
   )

   const handleUpdate = useMutation(
      trpc.tasks.update.mutationOptions({
         onSuccess: () => {
            setTask({ title: '', description: '' })

            queryClient.invalidateQueries(trpc.tasks.list.pathFilter())

            if (taskId) {
               queryClient.invalidateQueries(trpc.tasks.getById.pathFilter())
            }

            const params = new URLSearchParams(searchParams.toString())
            params.delete('id')
            const query = params.toString()
            router.replace(query ? `${pathName}?${query}` : pathName, { scroll: false })

            return toast.add({
               type: 'success',
               description: 'Tarefa editada.'
            })
         },
         onError: (error: TRPCClientErrorLike<AppRouter>) => {
            console.log(error.message)

            return toast.add({
               type: 'error',
               description: 'Ocorreu um erro. Tente novamente.'
            })
         }
      })
   )

   useEffect(() => {
      taskId ?
         (taskItem && setTask(taskItem)) : setTask({ title: '', description: '' })
   }, [taskId, taskItem])

   return (
      <main className="h-screen flex flex-col items-center rounded-2xl border">
         <h1 className="text-2xl font-bold mt-4 md:text-3xl ">
            {task.title ? 'Editar tarefa' : 'Adicionar nota tarefa'}
         </h1>

         <form className="max-w-2xl mt-4 px-6 rounded-2x space-y-3">
            <input
               className="w-full rounded border border-slate-300 px-3 py-2"
               value={task.title}
               onChange={(event) => setTask(prev => ({ ...prev, title: event.target.value }))}
               maxLength={200}
               required
            />

            <textarea
               className="w-full rounded border border-slate-300 px-3 py-2"
               value={task.description}
               onChange={(event) => setTask(prev => ({ ...prev, description: event.target.value }))}
               maxLength={1000}
               rows={2}
            />

            <div className="flex justify-end gap-3">
               <Button
                  className="font-medium text-blue-600"
                  onClick={() => taskItem ?
                     handleUpdate.mutate({ id: taskId, ...task }) :
                     handleCreate.mutate({ title: task.title!, description: task.description })}>
                  {taskItem ? 'Salvar' : 'Criar tarefa'}
               </Button>

               <AlertDialogComponent
                  {...alertDialogContent}
                  open={false}
                  onOpenChange={() => !false} />
            </div>
         </form>
      </main >
   )
}