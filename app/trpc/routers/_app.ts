import { z } from 'zod'
import { baseProcedure, createTRPCRouter } from '../init'
import { TRPCError } from '@trpc/server'
import { Task } from '@/app/types/task'

const tRPCError = (message: string) => {
   throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message
   })
}

const tasksList: Task[] = []

export const appRouter = createTRPCRouter({
   tasks: createTRPCRouter({
      list: baseProcedure
         .query(async () => {
            try {
               return [...tasksList]
            } catch (error) {
               console.log(`Error: ${error}`)

               return tRPCError('Nao foi possivel buscar as tarefas. Tente novamente mais tarde.')
            }

         }),

      getById: baseProcedure
         .input(z.object({ id: z.string() }))
         .query(async ({ input }) => {
            try {
               const task = tasksList.find(task => task.id === input.id)

               if (!task) {
                  return tRPCError('Tarefa não encontrada.')
               }

               return task
            } catch (error) {
               console.log(`Error: ${error}`)

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

               tasksList.push(newTask)

               return newTask
            } catch (error) {
               console.log(`Error: ${error}`)

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
               const taskIndex = tasksList.findIndex(
                  (task) => task.id === input.id,
               )

               if (taskIndex === -1) {
                  return tRPCError('Tarefa não encontrada.')
               }

               tasksList[taskIndex] = { ...tasksList[taskIndex], ...input }

               return tasksList[taskIndex]
            } catch (error) {
               console.log(`Error: ${error}`)

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
            const taskIndex = tasksList.findIndex(
               (task) => task.id === id,
            )

            if (taskIndex === -1) {
               return tRPCError('Tarefa não encontrada.')
            }

            try {
               tasksList[taskIndex] = { ...tasksList[taskIndex], completed }

               return tasksList[taskIndex]
            } catch (error) {
               console.log(`Error: ${error}`)

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
            const taskIndex = tasksList.findIndex(
               (task) => task.id === id,
            )

            if (taskIndex === -1) {
               return tRPCError('Tarefa não encontrada.')
            }

            try {
               tasksList.splice(taskIndex, 1)

               return 'Tarefa deletada.'
            } catch (error) {
               console.log(`Error: ${error}`)

               return tRPCError('Nao foi possivel deletar a tarefa. Tente novamente mais tarde.')
            }
         })
   })
})

export type AppRouter = typeof appRouter
