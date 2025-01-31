"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, ArrowUpCircle, Circle, Edit2, Plus, Trash } from "lucide-react"
import React, { Dispatch, SetStateAction, useState } from "react" // Import React
import { PopulatedTask, Priority } from "@/models/TaskManagement"
import { Button } from "../ui/button"
import TaskManagementDelete from "../delete/TaskManagementDelete"

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
  tasks: PopulatedTask[], 
  setTasks: Dispatch<SetStateAction<PopulatedTask[]>>, 
  setTask: Dispatch<SetStateAction<PopulatedTask | undefined>> 
  setForm:Dispatch<SetStateAction<boolean>>
}
export default function KanbanBoard({tasks,setTasks,setTask,setForm}:KanbanBoardProps) {
  const [deletedialog,setDeletedialog]=useState(false)
  const [taskId,setTaskId]=useState('')
  const getTasksByPriority = (priority: Priority) => tasks.filter((task) => task.priority === priority)
  async function deleteHandler(id:string){
    setTaskId(id)
    setDeletedialog(true)
  }
  function editHandler(task:PopulatedTask){
    setTask(task)
    setForm(true)
  }
  return (
    <div className="p-6  min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(Priority).map((priority) => (
          <div key={priority} className="rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center ">
              {React.createElement(priorityIcons[priority], { className: `rounded-full  mr-2 ${priorityColors[priority]}` })}
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </h2>
            <div className="space-y-4">
              {
                tasks.length===0 &&
                <Card className="flex flex-col items-center justify-center p-6 h-40 border-dashed border-2 border-gray-300">
                <div className="text-gray-400 mb-2">{React.createElement(priorityIcons[priority], { size: 24 })}</div>
                <p className="text-gray-500 text-center mb-4">No tasks in this priority</p>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </Card>
              }
              {getTasksByPriority(priority).map((task) => (
                <Card  key={task._id} className=" shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{task.taskTitle}</CardTitle>
                    <CardDescription>Issue ID: {task.issueId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <Badge variant="secondary" className={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.userId.avatar_url} />
                      <AvatarFallback>{task.userId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Edit2 onClick={()=>editHandler(task)} color="grey" size={15} />
                    <Trash onClick={()=>deleteHandler(task._id)} color="grey" size={15} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <TaskManagementDelete setTasks={setTasks} open={deletedialog} setOpen={setDeletedialog} taskId={taskId} />

    </div>
  )
}

