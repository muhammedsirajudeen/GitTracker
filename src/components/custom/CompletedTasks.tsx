import { PopulatedTask, Priority } from "@/models/TaskManagement"
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"


type priorityValues=`${Priority}`

interface CompletedDialogProps{
    completedTasks:PopulatedTask[]
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
}

export default function CompletedTasksDialog({completedTasks,open,setOpen}:CompletedDialogProps) {
  
    const getPriorityIcon = (priority:priorityValues) => {
      switch (priority) {
        case "high":
          return <ArrowUp className="h-4 w-4 text-red-500" />
        case "medium":
          return <ArrowRight className="h-4 w-4 text-yellow-500" />
        case "low":
          return <ArrowDown className="h-4 w-4 text-green-500" />
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black">
          <DialogHeader>
            <DialogTitle>Completed Tasks</DialogTitle>
            <DialogDescription>Here&apos;s a list of all tasks that have been completed.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {completedTasks.map((task) => (
              <div key={task._id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{task.taskTitle}</h3>
                  {getPriorityIcon(task.priority)}
                </div>
                <p className="text-xs text-gray-500">Issue ID: {task.issueId}</p>
                <p className="text-xs text-gray-700 mt-1">{task.description}</p>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }
  