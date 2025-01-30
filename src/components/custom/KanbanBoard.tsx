"use client"

import { useState } from "react"
import { tasks as initialTasks } from "./data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, ArrowUpCircle, Circle } from "lucide-react"
import React from "react" // Import React
import { Priority, Task } from "@/models/TaskManagement"

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

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const getTasksByPriority = (priority: Priority) => tasks.filter((task) => task.priority === priority)

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
              {getTasksByPriority(priority).map((task) => (
                <Card key={task._id} className=" shadow-sm hover:shadow-md transition-shadow duration-200">
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
                      <AvatarImage src={`https://avatar.vercel.sh/${task.ownerId}`} />
                      <AvatarFallback>{task.ownerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

