export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import GithubServiceInstance from "@/service/GithubService";
import RepositoryServiceInstance from "@/service/RepositoryService";
import { isObjectIdOrHexString } from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,{params}:{params:{id:string}}){
    try {
        const {id}=params
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        Logger._logger.info(request.url)
        const github_token=cookies().get('github_token')
        //remember that user is authorized but not enough to send req mark this as that 
        if(!github_token){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY]},{status:HttpStatus.UNPROCESSABLE_ENTITY})
        }
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const repository=await RepositoryServiceInstance.getRepoById(id)
        if(!repository){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        /*
            @muhammedsirajudeen
            Note:
            The repository full name is usually like owner/repo 
         */
        const repoFullName=repository.full_name
        const closedIssues=await GithubServiceInstance.getClosedIssues(repoFullName,github_token.value)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],closedIssues:closedIssues},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}