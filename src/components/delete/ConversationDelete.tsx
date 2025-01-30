'use client'

import { Dispatch, SetStateAction } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { Chat, Conversation } from '@/models/Conversation';

interface ConversationDeleteProps {
    conversationId: string;
    isOpen: boolean;
    setIsOpen:Dispatch<SetStateAction<boolean>>
    setConversations:Dispatch<SetStateAction<Conversation[]>>
    setMessages:Dispatch<SetStateAction<Chat[]>>
}

export default function ConversationDelete({ conversationId,isOpen,setIsOpen,setConversations, setMessages }: ConversationDeleteProps) {
    // const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/conversation/${conversationId}`, { withCredentials: true })
            await axios.delete(`/api/chat/${conversationId}`,{withCredentials:true})
            toast({ description: 'Deleted successfully', className: 'bg-green-500 text-white' })
            setConversations(prev => prev.filter((p) => p._id !== conversationId))
            setMessages([])
            setIsOpen(false)
        } catch (error) {
            const clientError = error as Error
            console.log(clientError.message)
            toast({ description: 'Please try again', className: 'bg-red-500 text-white' })
        }

    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='bg-black' >
                <DialogHeader>
                    <DialogTitle>Delete Conversation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this conversation? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
