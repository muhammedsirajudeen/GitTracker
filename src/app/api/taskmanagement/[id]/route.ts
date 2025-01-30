import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import TaskServiceInstance from "@/service/TaskService";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserWithId } from "../../auth/github/route";
import { isObjectIdOrHexString } from "mongoose";


//used to get all the tasks
export async function GET(request:NextRequest,{params}:{params:{id:string}}){
    try {
        const {id}=params
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        Logger._logger.info(request.url)
        const tasks=TaskServiceInstance.getTasksByUserandRepo(user.id,id)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],tasks:tasks??[]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}


export async function PUT(request:NextRequest,{params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
        }
        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const taskManagement=await request.json()
        /*
            Author:
            @muhammedsirajudeen
            Complete this task just call the repo and pass it to the service ensure to
            implement form validation
        */
        const updatedTask=await TaskServiceInstance.updateTaskById(id,taskManagement)
        if(!updatedTask){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

export async function DELETE(request:NextRequest,{params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        /*
            Author:
            @muhammedsirajudeen
            In here ensure the task being deleted belongs to the owner indeed otherwise it may cause some issues
        */
        const deletedTask=await TaskServiceInstance.deleteTaskById(id)
        if(!deletedTask){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}