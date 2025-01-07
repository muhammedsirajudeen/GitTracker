'use server'
import axios from "axios"
import { cookies } from "next/headers"

export async function SearchRepo(query:string){
    try {   
        const cookie=cookies()
        const github_token_raw=cookie.get('github_token')
        if(!github_token_raw){
            return null
        }
        const github_token=github_token_raw.value
        console.log(query,github_token)
        const github_user=(await axios.get(
            'https://api.github.com/user',
            {
                headers:{
                    Authorization:`Bearer ${github_token}`
                }
            }
        )).data
        const github_username=github_user.login
        const repoResponse=await axios.get(
            `https://api.github.com/search/repositories?q=${query}+user:${github_username}&visibility=all`
        ,{
            headers:{
                Authorization:`Bearer ${github_token}`
            }
        }
        )
        return repoResponse.data
    } catch (error) {
        console.log(error)
        return null
    }
}