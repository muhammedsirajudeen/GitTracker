"use client"

import { Dispatch, SetStateAction, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { taskSchema, type TaskFormValues } from "@/lib/formSchema"
import useSWR from "swr"
import { useParams } from "next/navigation"
import { Badge } from "../ui/badge"
import { GitHubIssue } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { PopulatedTask, Priority } from "@/models/TaskManagement"



interface TaskManagementformProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    setTasks:Dispatch<SetStateAction<PopulatedTask[]>>
    task?:PopulatedTask
}

interface IssueResponse {
    status: number
    issues: GitHubIssue[]
}


export function TaskCreationDialog({ open, setOpen,setTasks,task }: TaskManagementformProps) {
    const { id } = useParams()
    const { data }: { data?: IssueResponse, isLoading: boolean } = useSWR(`/api/issues/${id}`)
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            taskTitle: task?.taskTitle,
            description: task?.description??"",
            priority: task?.priority?? Priority.MEDIUM,
            issueId: task?.issueId??"",
        },
    })
    useEffect(() => {
        if (task) {
            form.reset({
                taskTitle: task.taskTitle,
                description: task.description ?? "",
                priority: task.priority ?? Priority.MEDIUM,
                issueId: task.issueId ?? "",
            });
        }
    }, [task, form]);
    async function onSubmit(data: TaskFormValues) {
        if(task){
            //it means that it is a put request
            try {
                const response=await axios.put(`/api/taskmanagement/${task._id}`,data,{withCredentials:true})
                console.log(response.data)
                toast({description:'task edited successfully successfully',className:'bg-green-500 text-white'})
                // setTasks(prev=>[...prev,response.data.task])
                setTasks(prev=>prev.map(p=>p._id===task._id?response.data.task:p))
                setOpen(false)

            } catch (error) {
                const axiosError=error as Error
                console.log(axiosError.message)
                toast({description:'please try again',className:'bg-red-500 text-white'})
            }
            return
        }
        try {
            const response=await axios.post(`/api/taskmanagement/${id}`,data,{withCredentials:true})
            console.log(response.data)
            toast({description:'task created successfully',className:'bg-green-500 text-white'})
            setTasks(prev=>[...prev,response.data.task])
            setOpen(false)
        } catch (error) {
            const axiosError=error as Error
            console.log(axiosError.message)
            toast({description:'please try again',className:'bg-red-500 text-white'})
        }
        //   setOpen(false)
        //   form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="sm:max-w-[425px] bg-black">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Fill in the details to create a new task. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="taskTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter task title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter task description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Priority).map((priority) => (
                                                <SelectItem key={priority} value={priority}>
                                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issueId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Related Issue</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select related issue" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data?.issues?.map((issue) => (
                                                <SelectItem key={issue.id} value={issue.id.toString()} className="py-2 px-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">#{issue.number}</span>
                                                        <span className="truncate flex-1">{issue.title}</span>
                                                        <Badge variant={issue.state === "open" ? "default" : "secondary"}>
                                                            {issue.state}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save Task</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

