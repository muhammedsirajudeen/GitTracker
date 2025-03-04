import AdminUsersPageComponent from "@/components/AdminUsersPageComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async  function UsersPage(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user || user.role!=="admin"){
        redirect('/')
    }
    return(
        <AdminUsersPageComponent/>
    )
}