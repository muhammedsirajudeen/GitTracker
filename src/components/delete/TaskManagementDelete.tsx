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
import { PopulatedTask } from "@/models/TaskManagement"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { HttpStatus } from "@/lib/HttpStatus"

interface TaskManagementDeleteProps {
  taskId: string
  open:boolean
  setOpen:Dispatch<SetStateAction<boolean>>
  setTasks:Dispatch<SetStateAction<PopulatedTask[]>>
}

export default function TaskManagementDelete({ taskId,open,setOpen,setTasks }: TaskManagementDeleteProps) {

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/taskmanagement/${taskId}`,{withCredentials:true})
      setTasks((prev)=>prev.filter(p=>p._id!==taskId))
      toast({description:'task deleted successfully',className:"bg-green-500 text-white"})
      setOpen(false)
    } catch (error) {
      const axiosError=error as AxiosError
      if(axiosError.status===HttpStatus.INTERNAL_SERVER_ERROR){
        toast({description:'please try again',className:"bg-red-500 text-white"})
      }else if(axiosError.status===HttpStatus.NOT_FOUND){
        toast({description:'task not found',className:"bg-red-500 text-white"})
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black" >
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
          <DialogDescription>This action cannot be undone. This will permanently delete the task.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

