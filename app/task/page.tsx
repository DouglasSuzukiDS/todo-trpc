import { Suspense } from "react";
import { TaskForm } from "../components/taskForm";

export default function Page() {
   return (
      <Suspense fallback={<p className="py-8 text-center text-slate-500">Carregando...</p>}>
         <TaskForm />
      </Suspense>
   )
} 