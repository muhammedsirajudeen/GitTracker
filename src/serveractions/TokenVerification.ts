"use server"
import { verifyToken } from "@/lib/jwtHelper"
import { cookies } from "next/headers"

export async function TokenVerification(){
    try {
      const cookieStore=cookies()
      const access_token=cookieStore.get('access_token')
      if(!access_token){
        return null
      }
      const access_token_value=access_token.value
      const decodedUser=await verifyToken(access_token_value)
      return decodedUser    
    } catch (error) {
      console.log(error)
      return null
    }
  }