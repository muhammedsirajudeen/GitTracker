import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { RedisGenericRemover, RedisOtpGetter } from "@/lib/redisHelper"
import UserServiceInstance from "@/service/UserService"
import { NextResponse } from "next/server"
import { UserWithId } from "../github/route"

interface ForgotRequest{
    email:string
    password:string
    uuid:string
}

export async function POST(request:Request){
    try {
        const forgotRequest=await request.json() as ForgotRequest
        const uuid=await RedisOtpGetter(forgotRequest.email,'forgot')
        if(!uuid || uuid!==forgotRequest.uuid){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        //now we have to check if the user is verified and also if the user is there
        const user=await UserServiceInstance.getUserByEmail(forgotRequest.email) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        const status=await UserServiceInstance.changePassword(user.id,forgotRequest.password)
        if(status){
            await RedisGenericRemover(forgotRequest.email,'forgot')
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
        }else{
            throw new Error('failed to change password')
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}