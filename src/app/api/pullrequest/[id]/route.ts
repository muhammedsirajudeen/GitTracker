export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";
import {HttpStatus, HttpStatusMessage} from "@/lib/HttpStatus";
import {GetUserGivenAccessToken} from "@/lib/tokenHelper";
import {cookies} from "next/headers";
import GithubServiceInstance from "@/service/GithubService";

export async function GET(request:Request,{params}:{params:{id:string}}){
    try{
        const {id:fullname}=params
        const repowithowner=fullname.replace('~','/')
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const cookie=cookies()
        const github_token=cookie.get("github_token")
        if(!github_token){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY]},{status:HttpStatus.UNPROCESSABLE_ENTITY})
        }
        //try to send repoid here as well
        const prOfUser=await GithubServiceInstance.getPullRequestByRepoOfToken(github_token.value,repowithowner)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],pullrequests:prOfUser},{status:HttpStatus.OK})
    }catch (error){
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}