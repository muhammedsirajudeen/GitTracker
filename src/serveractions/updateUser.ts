'use server'

import Logger from "@/lib/LoggerHelper";
import { User } from "@/models/User";
import UserServiceInstance from "@/service/UserService";

export default async function updateUser(userid:string,User:Partial<User>){
    try {
        console.log(userid,User)
        const status=UserServiceInstance.updateUserById(userid,User)
        if(!status){
            throw new Error('Failed to update user')
        }
        return true
    } catch (error) {
        const serverActionError=error as Error
        Logger._logger.error(serverActionError.message)
        return false
    }
}