import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PopulatedBounty} from "@/components/BountyPageComponent";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {GitPullRequest} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import useSWR from "swr";
import {fetcher} from "@/components/RepositoryListing";
import {PullRequest} from "@/lib/types";
import PullRequestList from "@/components/custom/PullRequest";


interface PrDialogProps {
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    bounty:PopulatedBounty|undefined
}


interface PullRequestResponse{
    pullrequests:PullRequest[]
    status:number
}



export default  function PrDialog({open, setOpen, bounty}: PrDialogProps) {
    const fullname=bounty?.repositoryId.full_name.replace('/','~')
    const {data,isLoading}:{data:PullRequestResponse | undefined,isLoading:boolean}=useSWR(`/api/pullrequest/${fullname}`,fetcher)
    const [pullrequests,setPullrequests]=useState<PullRequest[]>([])
    useEffect(()=>{
        if(data){
            setPullrequests(data.pullrequests)
        }
    },[data])
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="max-w-4xl bg-black" >
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center">
                        <GitPullRequest/>
                        <p className="ml-2">Select Your PR.</p>
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        select your closed pr to correctly gain your bounty only merged pr&#39;s would appear here.
                    </DialogDescription>
                    {/* fetch the bounty details here */}
                    <div className="flex w-full items-center justify-center">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={bounty?.ownerId.avatar_url}/>
                            <AvatarFallback>{bounty?.ownerId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Badge className="ml-2 h-4">{bounty?.repositoryId.name}</Badge>
                </div>
                </DialogHeader>
                <div className="w-full flex items-center justify-center" >
                    <PullRequestList bounty={bounty} pullRequests={pullrequests}/>
                </div>

            </DialogContent>
        </Dialog>

    )
}