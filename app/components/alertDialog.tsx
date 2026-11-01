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

type Props = {
   triggerText: string
   titleText: string
   descriptionText: string
   cancelBtnText: string
   cancelBtnAction?: () => void
   confirmBtnText: string
   confirmBtnAction?: () => void
}

export const AlertDialogComponent = (
   { triggerText, titleText, descriptionText, cancelBtnText, cancelBtnAction, confirmBtnText, confirmBtnAction }: Props) => {
   return (
      <AlertDialog>
         <AlertDialogTrigger className="text-sm font-bold text-red-600 bg-transparent px-4 rounded-lg border border-red-600 hover:text-white hover:bg-red-600 hover:border-none">
            {triggerText}
         </AlertDialogTrigger>

         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{titleText}</AlertDialogTitle>

               <AlertDialogDescription>
                  {descriptionText}
               </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
               <AlertDialogCancel
                  className="text-sm font-bold text-blue-600 px-4 rounded-lg border border-blue-600 hover:text-white hover:bg-blue-600 hover:border-none"
                  onClick={cancelBtnAction}>
                  {cancelBtnText}
               </AlertDialogCancel>

               <AlertDialogAction
                  className="text-sm font-bold text-red-600 bg-transparent px-4 rounded-lg border border-red-600 hover:text-white hover:bg-red-600 hover:border-none"
                  onClick={confirmBtnAction}>
                  {confirmBtnText}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}