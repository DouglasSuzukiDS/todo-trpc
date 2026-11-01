import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '../init'
import { api } from '@/app/utils/api'
import { TRPCError } from '@trpc/server'

const taskIdInput = z.object({ id: z.string().min(1, 'O id da tarefa é obrigatório.') })

const tRPCError = (message: string) => {
   throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message
   })
}

export const appRouter = createTRPCRouter({
   tasks: createTRPCRouter({
      list: baseProcedure
         .query(async () => {
            try {
               const tasks = await api.get('/tasks')

               return tasks.data
            } catch (error) {
               console.log(`Erorr: ${error}`)

               return tRPCError('Nao foi possivel buscar as tarefas. Tente novamente mais tarde.')
            }

         }),

      getById: baseProcedure
         .input(z.object({ id: z.string() }))
         .query(async ({ input }) => {
            try {
               const task = await api.get(`/tasks/${input.id}`)
               return task.data
            } catch (error) {
               return tRPCError('Tarefa não encontrada.')
            }
         }),

      create: baseProcedure
         .input(
            z.object({
               title: z.string()
                  .min(1, 'O título da tarefa é obrigatório.')
                  .max(200, 'O título da tarefa deve ter no máximo 200 caracteres.'),
               description: z.string()
                  .max(1000, 'A descrição da tarefa deve ter no máximo 1000 caracteres.').optional()
            })
         )
         .mutation(async ({ input }) => {
            try {
               const newTask: Task = {
                  id: crypto.randomUUID(),
                  title: input.title,
                  description: input.description,
                  created_at: new Date().toISOString(),
                  completed: false,
               }

               await api.post('/tasks', newTask)

               return newTask
            } catch (error) {
               console.log(`Erorr: ${error}`)

               return tRPCError('Nao foi possivel criar a tarefa. Tente novamente mais tarde.')
            }
         }),

      update: baseProcedure
         .input(
            z.object({
               id: z.string(),
               title: z.string().max(200),
               description: z.string().max(1000).optional()
            })
         )
         .mutation(async ({ input }) => {
            try {
               const { id, ...rest } = input

               let task = await api.patch(`/tasks/${id}`, { ...rest })

               return task.data
            } catch (error) {
               console.log(`Erorr: ${error}`)

               return tRPCError('Nao foi possivel atualizar a tarefa. Tente novamente mais tarde.')
            }
         }),

      toggle: baseProcedure
         .input(
            z.object({
               id: z.string(),
               completed: z.boolean()
            })
         )
         .mutation(async ({ input }) => {
            const { id, completed } = input

            try {
               let task = await api.patch(`/tasks/${id}`, { completed })

               return task.data
            } catch (error) {
               console.log(`Erorr: ${error}`)

               return tRPCError('Nao foi possivel atualizar o status da tarefa. Tente novamente mais tarde.')
            }
         }),

      delete: baseProcedure
         .input(
            z.object({
               id: z.string()
            })
         )
         .mutation(async ({ input }) => {
            const { id } = input

            try {
               await api.delete(`/tasks/${id}`)

               return 'Tarefa deletada.'
            } catch (error) {
               console.log(`Erorr: ${error}`)

               return tRPCError('Nao foi possivel deletar a tarefa. Tente novamente mais tarde.')
            }
         })
   })
})

export type AppRouter = typeof appRouter
