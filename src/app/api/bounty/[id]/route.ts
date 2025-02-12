import { bountyFormSchema } from "@/lib/formSchema";
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { BountyForm } from "@/lib/types";
import BountyServiceInstance from "@/service/BountyService";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"
import { UserWithId } from "../../auth/github/route";
import Logger from "@/lib/LoggerHelper";
import GithubServiceInstance from "@/service/GithubService";
import RepositoryServiceInstance from "@/service/RepositoryService";




export async function GET(request:Request,{params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        const bounties=await BountyServiceInstance.getBounties(id)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bounties:bounties??[]}, {status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]}, {status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}


export async function POST(request:Request){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        console.log(user)
        const githubToken=cookies().get('github_token')
        if(!githubToken){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]}, {status:HttpStatus.UNAUTHORIZED})
        }
        const {issueId, description, title, bountyAmount,repositoryId} = await request.json() as BountyForm
        try {
            bountyFormSchema.parse({issueId, description, title, bountyAmount})            
        } catch (error) {
            console.log(error)
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]}, {status:HttpStatus.BAD_REQUEST})
        }
        const repository=await RepositoryServiceInstance.getRepoById(repositoryId)
        if(!repository){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]}, {status:HttpStatus.NOT_FOUND})
        }
        const privateStatus=await GithubServiceInstance.getRepoStatus(githubToken.value,repository.full_name)
        if(privateStatus){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]}, {status:HttpStatus.CONFLICT})
        }
        //owner id things like that
        const newBounty=await BountyServiceInstance.addBounty({issueId,description,title,repositoryId:new mongoose.Types.ObjectId(repositoryId),ownerId:new mongoose.Types.ObjectId(user.id),bountyAmount:parseInt(bountyAmount),assignees:[]})
        if(!newBounty){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]}, {status:HttpStatus.CONFLICT})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bounty:newBounty}, {status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]}, {status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        const deleteBountyById = await BountyServiceInstance.deleteBountyById(id)
        //handle all cases but for now handle conflict
        if(!deleteBountyById){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]}, {status:HttpStatus.CONFLICT})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]}, {status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}
//to update the assignee part
export async function PUT(request:Request, {params}:{params:{id:string}}){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id}=params
        const {userId}=await request.json()
        if(!userId){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const assignmentStatus=await BountyServiceInstance.addAssignee(userId,id)
        if(!assignmentStatus){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        //from here interact with the smart contract section as well


        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError = error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}