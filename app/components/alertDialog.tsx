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
   open?: boolean
   onOpenChange?: () => void
}

export const AlertDialogComponent = (
   { triggerText, titleText, descriptionText, cancelBtnText, cancelBtnAction, confirmBtnText, confirmBtnAction, open, onOpenChange }: Props) => {
   return (
      <AlertDialog open onOpenChange={onOpenChange}>
         <AlertDialogTrigger className="font-medium text-slate-500">
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
               <AlertDialogCancel onClick={cancelBtnAction}>
                  {cancelBtnText}
               </AlertDialogCancel>

               <AlertDialogAction onClick={confirmBtnAction}>
                  {confirmBtnText}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}