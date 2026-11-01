'use client'

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"
import { useTRPC } from "../trpc/client"
import { TRPCClientErrorLike } from "@trpc/client"
import { AppRouter } from "../trpc/routers/_app"
import { toast } from "@/components/ui/toast"

const TaskComponent = () => {
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [task, setTask] = useState<Partial<Task>>({ title: '', description: '' })

   const trpc = useTRPC()
   const queryClient = useQueryClient()

   const router = useRouter()
   const searchParams = useSearchParams()
   const taskId = searchParams.get('id')

   const { data: taskItem, isLoading } = useQuery(
      trpc.tasks.getById.queryOptions(
         { id: taskId! },
         { enabled: !!taskId }
      )
   ) as { data: Task }

   const handleCreate = useMutation(
      trpc.tasks.create.mutationOptions({
         onSuccess: () => {
            setTitle('')
            setDescription('')

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
      taskItem && setTask(taskItem)
   }, [taskItem])

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
                     handleCreate.mutate({ title, description })}>
                  {taskItem ? 'Salvar' : 'Criar tarefa'}
               </Button>

               <AlertDialog>
                  {/* O asChild avisa ao Radix para transformar o próprio Button abaixo no botão de clique */}
                  <AlertDialogTrigger className="font-medium text-slate-500">
                     Cancelar
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Suas alterações não salvas serão perdidas. Deseja voltar para a página inicial?
                        </AlertDialogDescription>
                     </AlertDialogHeader>

                     <AlertDialogFooter>
                        <AlertDialogCancel>
                           Continuar editando
                        </AlertDialogCancel>

                        <AlertDialogAction onClick={() => router.push('/')}>
                           Voltar à home
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>

            </div>
         </form>
      </main >
   )
}

export default function Page() {
   return (
      <Suspense fallback={<p className="py-8 text-center text-slate-500">Carregando...</p>}>
         <TaskComponent />
      </Suspense>
   )
}