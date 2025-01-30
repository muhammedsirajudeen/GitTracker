import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import ConversationServiceInstance from "@/service/ConversationService";
import RepositoryServiceInstance from "@/service/RepositoryService";
import { isObjectIdOrHexString } from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserWithId } from "../../auth/github/route";
import { Repository } from "@/models/Repository";
import { Conversation } from "@/models/Conversation";

export interface RepositoryWithId extends Repository{
    _id:string
}

export async function GET(request:NextRequest,{params}:{params:{id:string}}){
    try {
        Logger._logger.info(request.url)
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        //this is the repository id so with the repo id and userid we fetch the user details
        const repository=await RepositoryServiceInstance.getRepoById(id) as RepositoryWithId
        console.log(repository)
        if(!repository){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        const getConversations=await ConversationServiceInstance.getConversationsByFilter(user.id,repository._id)
        console.log(getConversations)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],conversations:getConversations??[]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

export async function POST(request:NextRequest,{params}:{params:{id:string}}){
    try {
        Logger._logger.info(request.url)
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }

        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const conversation=await request.json() as Conversation
        conversation.userId=user.id
        if(!conversation){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        //repo and service
        const newConversation=await ConversationServiceInstance.createConversation(conversation)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.CREATED],conversation:newConversation},{status:HttpStatus.CREATED})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
} 
export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try {
        /*
            Author:
            @muhammedsirajudeen
            Remember that this id is the conversation id 
        */
        const {id}=params
        const deletionStatus=await ConversationServiceInstance.deleteConversation(id)
        if(!deletionStatus){
            throw new Error('Failed to delete')
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}