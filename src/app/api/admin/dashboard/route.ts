import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import Logger from "@/lib/LoggerHelper"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import UserServiceInstance from "@/service/UserService"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request:NextRequest){
    try {
        Logger._logger.info(request.url)
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const userCount=await UserServiceInstance.getCountsofUser()
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],
            userCount:userCount
        },{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}