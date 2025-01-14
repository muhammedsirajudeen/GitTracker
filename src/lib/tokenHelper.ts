import { UserWithId } from "@/app/api/auth/github/route"
import { verifyToken } from "./jwtHelper"
import UserServiceInstance from "@/service/UserService"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export async function GetUserGivenAccessToken(cookie:ReadonlyRequestCookies){
    const access_token = cookie.get('access_token')
    if(!access_token){
        return null
    }
    const decodedUser=await verifyToken(access_token.value) as UserWithId
    if(!decodedUser){
        return null
    }
    const user=await UserServiceInstance.getUserById(decodedUser.id)
    return user
}