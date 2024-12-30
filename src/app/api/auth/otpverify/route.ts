import { RedisOtpGetter } from "@/lib/redisHelper"
import UserServiceInstance from "@/service/UserService"
import { NextRequest, NextResponse } from "next/server"
//refactor everything
export async function POST(request: NextRequest) {
    try {
        const OtpRequest = await request.json()
        const otp = await RedisOtpGetter(OtpRequest.email)
        console.log(otp)
        //verifying otp essentially over
        if (otp === OtpRequest.otp) {
            const status=await UserServiceInstance.VerifyUser(OtpRequest.email)
            if(!status){
                return NextResponse.json({message:"please try again"},{status:500})
            }
            return NextResponse.json({ message: "success" }, { status: 200 })
        } else {
            return NextResponse.json({ message: "please try again" }, { status: 401 })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'internal server error' }, { status: 500 })
    }
}