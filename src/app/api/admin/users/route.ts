import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { cookies } from "next/headers";
import UserServiceInstance from "@/service/UserService";
import { isObjectIdOrHexString } from "mongoose";
export async function GET(request:NextRequest){
    try {
        Logger._logger.info(request.url)
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {searchParams}=new URL(request.url)
        const page=searchParams.get('page')??"0"
        const users=await UserServiceInstance.getAllUsersAdmin(parseInt(page))
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],users:users},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

export async function PATCH(request:NextRequest){
    try {
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED}) 
        }
        const {userId}=await request.json()

        if(!userId || !isObjectIdOrHexString(userId)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})

    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}