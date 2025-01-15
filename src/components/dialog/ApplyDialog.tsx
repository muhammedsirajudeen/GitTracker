import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { PopulatedBounty } from "../BountyPageComponent";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "@/hooks/use-toast";
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import axios, { AxiosError } from "axios";

interface ApplyDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    bounty: PopulatedBounty | undefined;
}

export default function ApplyDialog({ open, setOpen, bounty }: ApplyDialogProps) {
    async function applyHandler(){
        try {
            const response=await axios.post('/api/bounty/application',{bountyId:bounty?._id},{withCredentials:true});
            console.log(response.data)
        } catch (error) {
            console.log(error)
            const axiosError=error as AxiosError
            if(axiosError.status === HttpStatus.BAD_REQUEST){
                toast({ description:HttpStatusMessage[HttpStatus.BAD_REQUEST], className: "bg-red-500 text-white" })
            }else if(axiosError.status === HttpStatus.CONFLICT){
                toast({ description:'Already Applied', className: "bg-red-500 text-white" })
            }
            else{
                toast({ description:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR], className: "bg-red-500 text-white" })
            }

            // toast({description:})
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apply for Bounty</DialogTitle>
                    <DialogDescription>
                        Review the details below before confirming your application.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="p-4 rounded-md">
                        <p className="text-sm font-medium ">Bounty Title:</p>
                        <p className="text-lg font-semibold">{bounty?.title || "No title available"}</p>
                    </div>
                    <div className=" p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-600">Posted By:</p>
                        <div className="flex mt-4" >
                            <Avatar className="h-8 w-8 mr-4" >
                                <AvatarImage className="rounded-full"  src={bounty?.ownerId.avatar_url}/>
                                <AvatarFallback>{bounty?.ownerId.email.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className="text-lg font-semibold">                            
                                {bounty?.ownerId.email || "Email not available"}
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={applyHandler}>
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
