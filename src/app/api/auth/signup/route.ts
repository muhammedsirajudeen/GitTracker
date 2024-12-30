import { hashPassword } from "@/lib/bcryptHelper"
import { sendEmail } from "@/lib/emailHelper"
import { RedisOtpHelper } from "@/lib/redisHelper"
import { User } from "@/models/User"
import UserServiceInstance from "@/service/UserService"
import { NextResponse } from "next/server"

function generateSixDigitRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

export async function POST(request: Request) {
    try {
        const signupRequest=await request.json() as User
        const findUser=await UserServiceInstance.getUserByEmail(signupRequest.email)
        if(findUser){
            return NextResponse.json({message:'user with email exists'},{status:409})
        }else{
            const hashedPassword=await hashPassword(signupRequest.password)
            signupRequest.password=hashedPassword
            const newUser=await UserServiceInstance.InsertUser(signupRequest)
            if(newUser){
                const otp=generateSixDigitRandomNumber()
                await sendEmail(signupRequest.email,'USER VERIFICATION',`your otp is ${otp}`)
                const status=await RedisOtpHelper(signupRequest.email,otp)
                if(!status){
                    return NextResponse.json({message:'please try again'},{status:500})
                }
                return NextResponse.json({ message: 'success' },{status:201}) 
            }else{
                return NextResponse.json({ message: 'please try again' },{status:500})
            }
        }        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:'Internal Server Error Occured'},{status:500})
    }
}   