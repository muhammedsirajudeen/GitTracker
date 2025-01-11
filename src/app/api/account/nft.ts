import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { NextResponse } from "next/server"

export async function POST(request:Request){
    try {
        const {userAddress}=await request.json()
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }

}