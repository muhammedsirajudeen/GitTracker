import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Logger from "@/lib/LoggerHelper"
export async function GET(request:NextRequest){
    try {
        const {searchParams}=new URL(request.url)
        const page=searchParams.get('page')??"0"
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        //fetch all users
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],transactions:[]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}