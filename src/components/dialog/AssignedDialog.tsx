import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {BookMarked, DollarSign} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import {PopulatedBounty} from "@/components/BountyPageComponent";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface AssignedDialogProps{
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    setPrDialog:Dispatch<SetStateAction<boolean>>
    setPopulatedBounty:Dispatch<SetStateAction<PopulatedBounty|undefined>>
}


interface BountyAssignedResponse{
    assignedBounties:PopulatedBounty[]
    status:number
}

export default function AssignedDialog({open,setOpen,setPrDialog,setPopulatedBounty}:AssignedDialogProps) {
    const {data,isLoading}:{data:BountyAssignedResponse,isLoading:boolean}=useSWR('/api/bounty/assigned',fetcher)
    const [assignedBounties,setAssignedBounties]=useState<PopulatedBounty[]>([])
    console.log(assignedBounties)
    useEffect(()=>{
        if(data){
            setAssignedBounties(data.assignedBounties)
        }
    },[data])
    function completionHandler(assignedBounty:PopulatedBounty){
        setOpen(false)
        setPrDialog(true)
        setPopulatedBounty(assignedBounty)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="bg-black max-w-4xl min-h-4xl">
                <DialogHeader>
                    <DialogTitle className="w-full text-center" >Bounties Assigned To You</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignedBounties.map((assignedBounty) => (
                        <Card key={assignedBounty._id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{assignedBounty.title}</CardTitle>
                                <div className="flex w-full items-center justify-start" >
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage  src={assignedBounty.ownerId.avatar_url}/>
                                        <AvatarFallback>{assignedBounty.ownerId.email.slice(0,2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <Badge className="ml-2 h-4" >{assignedBounty.repositoryId.name}</Badge>
                                </div>
                                <CardDescription>{assignedBounty.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{assignedBounty.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4"/>
                                    {assignedBounty.bountyAmount}
                                </Badge>
                                <span className="text-sm text-gray-500">ID: {assignedBounty.issueId}</span>
                            </CardFooter>
                                <Button className="h-6 bg-inherit hover:bg-gray-900 " onClick={()=>completionHandler(assignedBounty)} >
                                    <BookMarked color={"white"} />
                                    <p className="text-xs font-bold text-white" >Mark as completed</p>
                                </Button>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>

    )
}