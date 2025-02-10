import React, { Dispatch, SetStateAction, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { ClipLoader } from 'react-spinners';
import { GitHubIssue } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';

interface CloseIssueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    issueNumber: number;
    setIssues:Dispatch<SetStateAction<GitHubIssue[]>>
    setAchievementdialog:Dispatch<SetStateAction<boolean>>
    setNft:Dispatch<SetStateAction<string>>
}

const CloseIssue: React.FC<CloseIssueProps> = ({ open, setOpen, issueNumber, setIssues, setAchievementdialog, setNft }) => {
    const {publicKey}=useWallet()
    const { id } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    async function deleteHandler() {
        setLoading(true)
        try {
            const response = await axios.patch(`/api/issues/${id}`, { issueNumber,walletAddress:publicKey }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Issue closed successfully:', response.data);
            toast({ description: "Issue closed successfully", className: "bg-green-500 text-white" })
            setOpen(false);
            setNft(response.data.nft??"")
            setAchievementdialog(true)
            setIssues((prevIssues) =>prevIssues.filter(issue=>issue.number!==issueNumber) )
        
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
        setLoading(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-black">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-warning">
                        <AlertTriangle className="h-5 w-5" />
                        Close Issue
                    </DialogTitle>
                    <DialogDescription className="text-white">
                        Are you sure you want to close this issue? You can reopen it later if needed.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-6 p-4 bg-warning/10 rounded-lg">
                    <p className="text-sm font-medium text-warning">
                        This will close the issue and you can reopen it anytime.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={deleteHandler}>
                        {
                            loading ?
                                <ClipLoader loading={loading} size={20} color="black" />
                                :
                                <p>Close Issue</p>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CloseIssue;
