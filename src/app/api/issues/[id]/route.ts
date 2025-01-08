import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { verifyToken } from "@/lib/jwtHelper"
import RepositoryServiceInstance from "@/service/RepositoryService"
import axios from "axios"
import { Issue } from "next/dist/build/swc"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function GET(request:Request,{params}:{params:{id:string}}){
    try {
        const {id}=params
        const searchParams=new URL(request.url).searchParams
        const page=searchParams.get('page')??"1"

        const cookie=cookies()
        const access_token=cookie.get('access_token')
        const github_token=cookie.get('github_token')
        if(!access_token){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        if(!github_token){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY]},{status:HttpStatus.UNPROCESSABLE_ENTITY})
        }
        const repository=await RepositoryServiceInstance.getRepoById(id)
        if(!repository){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        const decodedUser=await verifyToken(access_token.value) 
        if(!decodedUser){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const userResponse=await axios.get("https://api.github.com/user",
            {
                headers:{
                    Authorization:`token ${github_token.value}`
                }
            }
        )
        const username=userResponse.data.login
        const url = `https://api.github.com/repos/${username}/${repository.name}/issues?page=${page}&per_page=10`;
        const headers = {
          Authorization: `token ${github_token.value}`,
          Accept: "application/vnd.github.v3+json",
        };
        const issueResponse=await axios.get(url,{headers})
        const issues=issueResponse.data as Issue[]
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],issues:issues??[]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}
