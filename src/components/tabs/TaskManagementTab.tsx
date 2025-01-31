'use client'
import { useEffect, useState } from "react";
import KanbanBoard from "../custom/KanbanBoard";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { TaskCreationDialog } from "../form/TaskManagementForm";
import { PopulatedTask } from "@/models/TaskManagement";
import useSWR from "swr";
import { fetcher } from "../RepositoryListing";
import CompletedTasksDialog from "../custom/CompletedTasks";

interface issueProps{
    tasks:PopulatedTask[]
    status:number
}

export default function TaskManagementComponent() {
    const {id}=useParams()
    const {data}=useSWR<issueProps>(`/api/taskmanagement/${id}`,fetcher)
    const [openform,setOpenForm]=useState(false)
    const [task,setTask]=useState<PopulatedTask>()
    const [tasks,setTasks]=useState<PopulatedTask[]>([])
    const [completedTasks,setCompletedTasks]=useState(false)
    useEffect(()=>{
        if(data){
            setTasks(data.tasks)
        }
    },[data])
    return (
        <div className="w-full flex items-center justify-center flex-col">
            <Button onClick={()=>{
                setOpenForm(true)
            }} >Create Task</Button>
            <Button onClick={()=>{
                setCompletedTasks(true)
            }} variant="outline" className="mt-4" >Completed Tasks</Button>
            <KanbanBoard  setTask={setTask} setForm={setOpenForm} setTasks={setTasks} tasks={tasks} />
            <TaskCreationDialog task={task} setTasks={setTasks} open={openform} setOpen={setOpenForm}/>
            <CompletedTasksDialog completedTasks={tasks.filter(p=>p.completed)} open={completedTasks} setOpen={setCompletedTasks}/>
        </div>
    )
}