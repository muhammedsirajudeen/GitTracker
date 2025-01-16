import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import RepositoryServiceInstance from "@/service/RepositoryService"
import axios from "axios"
import { isObjectIdOrHexString } from "mongoose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request,{params}:{params:{id:string}}) {
    try {
        const {id:githubRepoId}=params
        const user = await GetUserGivenAccessToken(cookies())
        if (!user) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        const githubToken=cookies().get('github_token')
        if(!githubToken || !isObjectIdOrHexString(githubRepoId)){
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY] }, { status: HttpStatus.UNPROCESSABLE_ENTITY })
        }
        const repository=await RepositoryServiceInstance.getRepoById(githubRepoId)
        if(!repository) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND })
        }
        const repoName=repository.full_name
        const response=await axios.post(`${process.env.BACKEND_URL}/dir/structure`,
            {
                githubRepo:repoName,
                githubToken:githubToken.value
            }
        )
        console.log(response.data)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK] }, { status: HttpStatus.OK })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}