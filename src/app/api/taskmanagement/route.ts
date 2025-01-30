import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import TaskServiceInstance from "@/service/TaskService"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { UserWithId } from "../auth/github/route"
import Logger from "@/lib/LoggerHelper"
export async function POST(request:NextRequest){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const taskManagement=await request.json()
        /*
            Author:
            @muhammedsirajudeen
            Complete the implementation of this
        */
       const createdTask=await TaskServiceInstance.createTask(taskManagement)
       if(!createdTask){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST}) 
       }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.CREATED],task:createdTask},{status:HttpStatus.CREATED})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}
