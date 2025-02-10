'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { toast } from '@/hooks/use-toast'
import { BountyWithUser } from '../tabs/Bounties'
import  { AxiosError } from 'axios'
import { HttpStatus } from '@/lib/HttpStatus'

interface DeleteBountyProps {
    bounty: BountyWithUser | undefined
    setBounties: Dispatch<SetStateAction<BountyWithUser[]>>
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
}

export default function DeleteBounty({ bounty, /*setBounties,*/open,setOpen }: DeleteBountyProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function deleteHandler() {
        setIsDeleting(true)
        try {
            // const response = await axios.delete(`/api/bounty/${bounty?._id}`, { withCredentials: true });
            // if (response.status === HttpStatus.OK) {
            //     setBounties(prevBounties => prevBounties.filter(bountyH => bountyH._id !== bounty?._id));
            //     toast({ description: 'Bounty deleted successfully', className: 'bg-green-500 text-white' });
            //     setTimeout(()=>setOpen(false),1000)
                
            // }
            toast({description:'Thinking about another flow here do it with next week',className:'bg-orange-500 text-white'})
        } catch (error) {
            console.log(error);
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                toast({ description: 'Please try again', className: 'bg-red-500 text-white' });
            } else if (axiosError.response?.status === HttpStatus.CONFLICT) {
                toast({ description: 'Bounty already assigned', className: 'bg-red-500 text-white' });
            } else {
                toast({ description: 'An error occurred', className: 'bg-red-500 text-white' });
            }
        }
        setIsDeleting(false)
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-black">
                <DialogHeader>
                    <DialogTitle>Delete Bounty</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this bounty? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-semibold">Title:</span>
                        <span className="col-span-3">{bounty?.title}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-semibold">Amount:</span>
                        <span className="col-span-3">${bounty?.bountyAmount}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={deleteHandler} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

