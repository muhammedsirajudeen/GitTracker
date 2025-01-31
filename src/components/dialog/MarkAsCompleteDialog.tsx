"use client"

import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { PopulatedTask } from "@/models/TaskManagement"

interface TaskManagementConfirmProps {
    taskId: string
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    setTasks:Dispatch<SetStateAction<PopulatedTask[]>>
}

export default function TaskManagementConfirm({ taskId, open, setOpen, setTasks }: TaskManagementConfirmProps) {
    const handleConfirm = async () => {
        try {
            const response = await fetch(`/api/taskmanagement/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: true }),
            })

            if (!response.ok) {
                throw new Error("Failed to mark task as complete")
            }

            // Close the dialog
            setOpen(false)
            toast({description:"task marked as complete",className:"bg-green-500 text-white"})
            setTasks(prev => prev.map(p => p._id === taskId ? { ...p, completed: true } : p))
            // Refresh the current route
        } catch (error) {
            console.error("Error marking task as complete:", error)
            // Handle error (e.g., show an error message to the user)
            toast({description:"please try again",className:"bg-red-500 text-white"})
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="bg-black" >
                <DialogHeader>
                    <DialogTitle>Mark task as complete?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to mark this task as complete? This action can be undone later if needed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

