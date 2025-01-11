import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { NextResponse } from "next/server"

export async function GET(request:Request,{ params }: { params: { id: string } }){
    try {
        const {id}=params
        console.log(id)
        //id here here is userAddress okay
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }

}