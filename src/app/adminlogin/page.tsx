import AdminLoginPageComponent from "@/components/AdminLoginPageComponent";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default  async function AdminLoginPage(){
    const user=await GetUserGivenAccessToken(cookies())
    console.log(user)
    if(user && user.role==="admin"){
        redirect('/adminhome')
    }
    return(
        <AdminLoginPageComponent/>
    )
}