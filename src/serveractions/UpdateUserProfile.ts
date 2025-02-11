"use server"

import { UserWithId } from "@/app/api/auth/github/route"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import UserServiceInstance from "@/service/UserService"
import { cookies } from "next/headers"

export async function UpdateUserProfile(avatar_url:string){
    try{
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return null
        }
        const userServiceInstance=await UserServiceInstance.updateUserByWallet(user.id,{avatar_url:avatar_url})
        return userServiceInstance
    }catch(error){
        console.log(error)
        return null
    }
}