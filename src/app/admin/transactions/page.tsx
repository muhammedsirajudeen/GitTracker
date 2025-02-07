import AdminTransactionsComponent from "@/components/AdminTransactionsComponent"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function TransactionsPage(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user || user.role!=="admin"){
        redirect('/')
    }
    return(
        <AdminTransactionsComponent/>
    )
}