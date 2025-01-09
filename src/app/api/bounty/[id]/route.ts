import { bountyFormSchema } from "@/lib/formSchema";
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { BountyForm } from "@/lib/types";
import { NextResponse } from "next/server"




export async function GET(){
    try {
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]}, {status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]}, {status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}



export async function POST(request:Request){
    try {
        const {issueId, ownerId, repositoryId, description, title, bountyAmount} = await request.json() as BountyForm
        try {
            bountyFormSchema.parse({issueId, ownerId, repositoryId, description, title, bountyAmount})            
        } catch (error) {
            console.log(error)
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]}, {status:HttpStatus.BAD_REQUEST})
        }

        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]}, {status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]}, {status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

