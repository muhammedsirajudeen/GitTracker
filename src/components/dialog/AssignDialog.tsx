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
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { ClipLoader } from "react-spinners";


interface AssignDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    bountyApplication: BountyApplicationWithId | undefined; //maybe add this to the props and use it here.

}

export default function AssignDialog({ open, setOpen, bountyApplication }: AssignDialogProps) {
    const {connected,publicKey,signTransaction,sendTransaction}=useWallet()
    const [loading,setLoading]=useState(false)
    async function assignHandler() {
        setLoading(true)
        toast({description:"Please wait...",className:"bg-blue-500 text-white"})
        if (!connected || !publicKey){
            toast({ description: "Please connect your wallet to continue", className: "bg-red-500 text-white" })
            return
        }
        try {

            //find a way to rollback
            const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
            const programId = new PublicKey('APDzchvffkKTxvptpoWgAXJrABoHAzaooaU9JN6urELy');
            const transaction = new Transaction();
            //most of this stuff is deprecated try to use the latest stuff
            const instruction = new TransactionInstruction({
                programId: programId,
                keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
                data: Buffer.from([]), // Include any required data for the smart contract function
              });
            transaction.add(instruction);
            const { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey; // Set the fee payer to the wallet's public key


            if(!signTransaction){
                toast({description:"Transaction signing failed",className:"bg-red-500 text-white"})
                return
            }
            const signedTransaction = await signTransaction(transaction);
            const signature: TransactionSignature = await sendTransaction(signedTransaction, connection);
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            if (confirmation.value.err) {
                toast({description:"Transaction Failed",className:"bg-red-500 text-white"})
            }
            toast({ description: "Transaction successfully completed", className: "bg-green-500 text-white" });
            //@ts-ignore
            const response = await axios.put(`/api/bounty/${bountyApplication?.bountyId._id}`, {userId:bountyApplication?.applicantId._id,walletAddress:publicKey?.toString()}, { withCredentials: true })
            console.log(response)
            setTimeout(()=>{
                    toast({ description: "Bounty assigned successfully", className: "bg-green-500 text-white" })
                    setOpen(false)
            },1000)


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
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={loading} variant="outline" onClick={assignHandler}>
                        {
                            loading ?
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