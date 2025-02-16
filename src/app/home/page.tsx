import Home from "@/components/HomeComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


//give route guards here
export default async function Page(){
  const user=await GetUserGivenAccessToken(cookies())
  
  if(!user){
    redirect('/')
  }
  return(
    <Home wallet_status={user.wallet_status} />
  )
}



