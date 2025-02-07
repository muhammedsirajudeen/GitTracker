import AdminRepositoriesComponent from "@/components/AdminRepositoriesComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Repositories(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user || user.role!=="admin"){
        redirect('/')
    }
    return(
        <AdminRepositoriesComponent/>
    )
}