import Home from "@/components/HomeComponent"
import { verifyToken } from "@/lib/jwtHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function TokenVerification(){
  const cookieStore=cookies()
  const access_token=cookieStore.get('access_token')
  console.log('the cookie is ',access_token)
  if(!access_token){
    return null
  }
  const access_token_value=access_token.value
  // const decodeUser=await 
}
//give route guards here
export default async function Page(){
  console.log(TokenVerification())
  // if(!tokenVerification){
  //   redirect('/')
  // }
  return(
    <Home/>
  )
}



