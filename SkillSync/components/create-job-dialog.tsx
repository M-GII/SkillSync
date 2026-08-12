import { Dialog, DialogContent, DialogTrigger,DialogHeader,DialogTitle,DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
interface CreateJobApplicationDialogProps{
    columnId:string, boardId:string
}

export default function CreateJobApplicationDialog({columnId,boardId}:CreateJobApplicationDialogProps){
    return (
        <Dialog>
            <DialogTrigger render={
                <Button variant="outline">
                    <Plus/>Add Job
                </Button>}>

            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Job Application</DialogTitle>
                    <DialogDescription>Track a new job application</DialogDescription>
                </DialogHeader>
                <form>
                    <div>
                        <div>
                            
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}