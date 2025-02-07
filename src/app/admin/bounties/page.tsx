import AdminBountiesComponent from "@/components/AdminBountiesComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async  function AdminBounties(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user){
        redirect('/')
    }
    return(
        <AdminBountiesComponent/>
    )
}