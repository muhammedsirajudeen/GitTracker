"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, ArrowUpCircle, Circle, Edit2, Plus, TicketCheck, Trash } from "lucide-react"
import React, { type Dispatch, type SetStateAction, useState } from "react"
import { type PopulatedTask, Priority } from "@/models/TaskManagement"
import { Button } from "../ui/button"
import TaskManagementDelete from "../delete/TaskManagementDelete"
import TaskManagementConfirm from "../dialog/MarkAsCompleteDialog"

const priorityColors = {
  [Priority.LOW]: "bg-blue-100 text-blue-800",
  [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [Priority.HIGH]: "bg-red-100 text-red-800",
}

const priorityIcons = {
  [Priority.LOW]: Circle,
  [Priority.MEDIUM]: ArrowUpCircle,
  [Priority.HIGH]: AlertCircle,
}

interface KanbanBoardProps {
  tasks: PopulatedTask[]
  setTasks: Dispatch<SetStateAction<PopulatedTask[]>>
  setTask: Dispatch<SetStateAction<PopulatedTask | undefined>>
  setForm: Dispatch<SetStateAction<boolean>>
}

export default function KanbanBoard({ tasks, setTasks, setTask, setForm }: KanbanBoardProps) {
  const [deletedialog, setDeletedialog] = useState(false)
  const [taskId, setTaskId] = useState("")
  const [completedDialog, setCompleteDialog] = useState<boolean>(false)

  const getTasksByPriority = (priority: Priority) =>
    tasks.filter((task) => task.priority === priority && !task.completed)

  function deleteHandler(id: string) {
    setTaskId(id)
    setDeletedialog(true)
  }

  function editHandler(task: PopulatedTask) {
    setTask(task)
    setForm(true)
  }

  function completeHandler(taskId: string) {
    setTaskId(taskId)
    setCompleteDialog(true)
  }

  return (
    <div className="p-6 min-h-screen ">
      {/* <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Task Management Board</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(Priority).map((priority) => (
          <div key={priority} className=" rounded-lg shadow-lg overflow-hidden">
            <div className={`p-4 ${priorityColors[priority]} border-b border-gray-200`}>
              <h2 className="text-xl font-semibold flex items-center">
                {React.createElement(priorityIcons[priority], { className: "mr-2", size: 24 })}
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </h2>
            </div>
            <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {tasks.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-6 h-40 border-dashed border-2 border-gray-300">
                  <div className="text-gray-400 mb-2">{React.createElement(priorityIcons[priority], { size: 24 })}</div>
                  <p className="text-gray-500 text-center mb-4">No tasks in this priority</p>
                  <Button variant="outline" size="sm" className="flex items-center" onClick={() => setForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </Card>
              ) : (
                getTasksByPriority(priority).map((task) => (
                  <Card
                    key={task._id}
                    className="shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">{task.taskTitle}</CardTitle>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.userId.avatar_url} />
                          <AvatarFallback>{task.userId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <CardDescription className="text-sm text-gray-500">Issue ID: {task.issueId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2">
                      <Badge
                        variant="secondary"
                        className={`${priorityColors[task.priority]} px-2 py-1 rounded-full text-xs`}
                      >
                        {task.priority}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => editHandler(task)}>
                          <Edit2 className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteHandler(task._id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => completeHandler(task._id)}>
                          <TicketCheck className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <TaskManagementDelete setTasks={setTasks} open={deletedialog} setOpen={setDeletedialog} taskId={taskId} />
      <TaskManagementConfirm setTasks={setTasks} taskId={taskId} open={completedDialog} setOpen={setCompleteDialog} />
    </div>
  )
}

