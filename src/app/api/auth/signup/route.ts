export const dynamic = "force-dynamic";

import { hashPassword } from "@/lib/bcryptHelper"
import { sendEmail } from "@/lib/emailHelper"
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { RedisOtpHelper } from "@/lib/redisHelper"
import { User } from "@/models/User"
import UserServiceInstance from "@/service/UserService"
import { NextResponse } from "next/server"

export function generateSixDigitRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

export async function POST(request: Request) {
    try {
        const signupRequest=await request.json() as User
        const findUser=await UserServiceInstance.getUserByEmail(signupRequest.email)
        if(findUser){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]},{status:HttpStatus.CONFLICT})
        }else{
            const hashedPassword=await hashPassword(signupRequest.password)
            signupRequest.password=hashedPassword
            const newUser=await UserServiceInstance.InsertUser(signupRequest)
            if(newUser){
                const otp=generateSixDigitRandomNumber()
                await sendEmail(signupRequest.email,'USER VERIFICATION',`your otp is ${otp}`)
                const status=await RedisOtpHelper(signupRequest.email,otp)
                if(!status){
                    return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
                }
                return NextResponse.json({ message: HttpStatusMessage[HttpStatus.CREATED] }, { status: HttpStatus.CREATED })
            }else{
                return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
            }
        }        
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}   