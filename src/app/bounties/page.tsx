import { redirect } from "next/navigation"
import { TokenVerification } from "../home/page"
import BountyPageComponent from "@/components/BountyPageComponent"

export default async function Page(){
    const user=await TokenVerification()
    if(!user){
        redirect("/login")
    }
    return(
        <>
            <BountyPageComponent/>
        </>
    )
}