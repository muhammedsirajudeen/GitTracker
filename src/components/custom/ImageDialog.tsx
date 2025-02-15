'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

interface ImageDialogProps{
    open:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    images:string[]
}

export  function ImageDialog({open,setOpen,images}:ImageDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="bg-black" >
                <DialogHeader>
                    <DialogTitle>Attachments</DialogTitle>
                    <DialogDescription>
                        All attachments of this task is shown here.
                    </DialogDescription>
                    {
                        images.map((image,index)=>{
                            return(
                                <Image key={index} src={image} width={100} height={100} alt="attachment"/>
                            )
                        })
                    }
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}