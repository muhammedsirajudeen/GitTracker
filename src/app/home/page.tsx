import Home from "@/components/HomeComponent"
import { verifyToken } from "@/lib/jwtHelper"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
//give route guards here
export default async function Page(){
  const token=await GetUserGivenAccessToken(cookies())
  console.log(token)
  if(!token){
    redirect('/')
  }
  return(
    <Home/>
  )
}



