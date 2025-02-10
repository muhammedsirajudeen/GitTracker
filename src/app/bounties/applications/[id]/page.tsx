import ApplicationsComponent from "@/components/ApplicationsPageComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ApplicationsPage(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user){
        redirect('/login')
    }
    return(
        <ApplicationsComponent/>
    )
}

