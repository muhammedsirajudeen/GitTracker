'use server'

import { frontendUrl } from "@/lib/backendUrl"
import { sendEmail } from "@/lib/emailHelper"
import { RedisOtpHelper } from "@/lib/redisHelper"
import { randomUUID } from "crypto"



export async function ForgotPassword(email:string){
    try {
        const uuid=randomUUID()
        sendEmail(email,'Change Password',`click on this like to change your password ${frontendUrl}/forgot?code=${uuid}`)
        RedisOtpHelper(email,uuid,'forgot')
        return true
    } catch (error) {
        console.log(error)
        return null
    }
}