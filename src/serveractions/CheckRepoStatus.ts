"use server"

import GithubServiceInstance from "@/service/GithubService"
import RepositoryServiceInstance from "@/service/RepositoryService"
import { cookies } from "next/headers"

export const CheckRepoPrivateStatus=async (repoid:string)=>{
    try {
        const githubToken=cookies().get('github_token')
        if(!githubToken){
            return true
        }
        const repository=await RepositoryServiceInstance.getRepoById(repoid)
        if(!repository){
            return true
        }
        const status=GithubServiceInstance.getRepoStatus(githubToken.value,repository?.full_name)
        return status
    } catch (error) {
        const actionError=error as Error
        console.log(actionError.message)
        return true
    }
}