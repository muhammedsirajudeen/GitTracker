import { useState } from "react";
import KanbanBoard from "../custom/KanbanBoard";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { TaskCreationDialog } from "../form/TaskManagementForm";
import { PopulatedTask } from "@/models/TaskManagement";

export default function TaskManagementComponent() {
    const {id}=useParams()
    console.log(id)
    const [openform,setOpenForm]=useState(false)
    const [tasks,setTasks]=useState<PopulatedTask[]>([])
    return (
        <div className="w-full flex items-center justify-center flex-col">
            <Button onClick={()=>{
                setOpenForm(true)
            }} >Create Task</Button>
            <KanbanBoard tasks={tasks} />
            <TaskCreationDialog setTasks={setTasks} open={openform} setOpen={setOpenForm}/>
        </div>
    )
}