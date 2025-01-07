import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { NextResponse } from "next/server"
import { generateSixDigitRandomNumber } from "../signup/route"
import { RedisOtpHelper } from "@/lib/redisHelper"

export async function POST(request:Request){
    try {
        const resendRequest=await request.json()
        console.log(resendRequest)
        const newOtp=generateSixDigitRandomNumber()
        await RedisOtpHelper(resendRequest.email,newOtp)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}