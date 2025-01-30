import KanbanBoard from "../custom/KanbanBoard";
import { Button } from "../ui/button";

export default function TaskManagement() {
    return (
        <div className="w-full flex items-center justify-center flex-col">
            <Button>Create Task</Button>
            <KanbanBoard/>
        </div>
    )
}