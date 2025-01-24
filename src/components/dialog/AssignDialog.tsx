import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { BountyApplicationWithId } from "../ApplicationsPageComponent";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import { ClipLoader } from "react-spinners";


interface AssignDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    bountyApplication: BountyApplicationWithId | undefined; //maybe add this to the props and use it here.

}

export default function AssignDialog({ open, setOpen, bountyApplication }: AssignDialogProps) {
    const [loading, setLoading] = useState(false)
    async function assignHandler() {
        setLoading(true)
        try {

            //@ts-ignore
            const response = await axios.put(`/api/bounty/${bountyApplication?.bountyId._id}`, { userId: bountyApplication?.applicantId._id, walletAddress: publicKey?.toString() }, { withCredentials: true })
            console.log(response)
            setTimeout(() => {
                toast({ description: "Bounty assigned successfully", className: "bg-green-500 text-white" })
                setOpen(false)
            }, 1000)


        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError
            if (axiosError.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                toast({ description: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR], className: "bg-red-500 text-white" })
            } else {
                toast({ description: "please try again", className: "bg-red-500 text-white" })
            }
        }
        setLoading(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Do you want to assign the bounty to this person?</DialogTitle>
                    <DialogDescription>
                        Do you really want to assign the bounty to this person its irreversible once the bounty is acknowledged?
                        The bounty amount would be transferred to our escrow account once you acknowledge this.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={loading} variant="outline" onClick={assignHandler}>
                        {
                            loading
                                ?
                                <ClipLoader loading={loading} size={20} color="whtte" />
                                :
                                <p>Assign</p>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}