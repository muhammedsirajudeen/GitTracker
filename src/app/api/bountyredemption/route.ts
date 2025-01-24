import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { BountyRedemption } from "@/models/BountyRedemption"
import { NextResponse } from "next/server"

export async  function POST(request:Request){
    try {
        const requestBody:BountyRedemption=await request.json()
        //logic to redeem bounty goes here
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}