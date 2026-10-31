import { useEffect, useState } from "react"

export const Task = (task?: Task, action: 'create' | 'update') => {
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')

   useEffect(() => {
      if (task) {
         setTitle(task.title)
         setDescription(task.title)
      }
   }, [])

   return (
      <form className="space-y-3">
         <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
         />

         <textarea
            className="w-full rounded border border-slate-300 px-3 py-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            rows={2}
         />

         <div className="flex gap-3">
            <button className="font-medium text-blue-600">
               {action === 'create' ? 'Criar tarefa' : 'Salvar'}
            </button>

            <button
               className="font-medium text-slate-500"
               type="button"
               onClick={() => { }}
            >
               Cancelar
            </button>
         </div>
      </form>
   )
}