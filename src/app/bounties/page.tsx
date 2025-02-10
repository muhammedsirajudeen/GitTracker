import { redirect } from "next/navigation"
import BountyPageComponent from "@/components/BountyPageComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"

export default async function Page(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user){
        redirect('/login')
    }
    return(
        <>
            <BountyPageComponent/>
        </>
    )
}