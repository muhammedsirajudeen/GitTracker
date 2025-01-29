import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import { Chat, Conversation } from "@/models/Conversation";
import ConversationServiceInstance from "@/service/ConversationService";
import { isObjectIdOrHexString } from "mongoose";
import { NextResponse } from "next/server";
import { UserWithId } from "../../auth/github/route";
import { cookies } from "next/headers";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import axios from "axios";
import RepositoryServiceInstance from "@/service/RepositoryService";
import { RepositoryWithId } from "../../conversation/[id]/route";

export async function POST(request:Request,{params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const githubToken=cookies().get('github_token')
        if(!githubToken){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const repository=await RepositoryServiceInstance.getRepoById(id) as RepositoryWithId
        if(!repository){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        const conversation=await request.json() as Conversation
        conversation.userId=user.id
        if(!conversation){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        //here generate the response from server
        const messagefromuser=conversation.chats[0].message
        const responsefromAi=await axios.post(`${process.env.BACKEND_URL}/api/v1/chat`,
            {
                session_id:user.id,
                github_token:githubToken.value,
                query:messagefromuser,
                repo_full_name:repository.full_name
            }
        )
        console.log(responsefromAi)
        conversation.chats.push(
            {
                from:"ai",
                message:responsefromAi.data.response,
                date:new Date(),
            }
        )
        const newConversation=await ConversationServiceInstance.createConversation(conversation)
        if(!newConversation){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]},{status:HttpStatus.CONFLICT})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.CREATED],conversation:newConversation},{status:HttpStatus.CREATED})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

export async function PUT(request:Request,{params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        const githubToken=cookies().get('github_token')
        if(!user || !githubToken){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const conversation=await request.json()
        const usermessage=conversation.chat.message
        const userChat:Chat[]=[conversation.chat]
        const {conversationId}=conversation
        if(!isObjectIdOrHexString(conversationId) || !userChat ){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const repository=await RepositoryServiceInstance.getRepoById(id)
        if(!repository){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        //now update the conversation by conversation id
        const responsefromAi=await axios.post(`${process.env.BACKEND_URL}/api/v1/chat`,
            {
                session_id:user.id,
                github_token:githubToken.value,
                query:usermessage,
                repo_full_name:repository.full_name
            }
        )
        userChat.push({
            from:"ai",
            message:responsefromAi.data.response,
            date:new Date()
        })
        const conversationResponse=await ConversationServiceInstance.updateConversation(conversationId,{chats:userChat})
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],conversation:conversationResponse},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}