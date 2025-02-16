export const dynamic = "force-dynamic";

import { RedisOtpGetter } from "@/lib/redisHelper"
import UserServiceInstance from "@/service/UserService"
import { NextRequest, NextResponse } from "next/server"
import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus"

export async function POST(request: NextRequest) {
    try {
        const OtpRequest = await request.json()
        const otp = await RedisOtpGetter(OtpRequest.email)
        console.log(otp)
        //verifying otp essentially over
        if (otp === OtpRequest.otp) {
            const status = await UserServiceInstance.VerifyUser(OtpRequest.email)
            if (!status) {
                return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR})
            }
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK] }, { status: HttpStatus.OK })
        } else {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}