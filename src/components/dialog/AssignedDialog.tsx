import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Dispatch, SetStateAction } from "react"

interface AssignedDialogProps{
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
}

export default function AssignedDialog({open,setOpen}:AssignedDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="bg-black max-w-4xl min-h-4xl" >
                <DialogHeader>
                    <DialogTitle>Bounties Assigned</DialogTitle>
                    {/* here fetch the details of the people assigned to the bounties */}
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}