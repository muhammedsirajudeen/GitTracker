import { TokenVerification } from "@/app/home/page"
import ApplicationsComponent from "@/components/ApplicationsPageComponent"
import { redirect } from "next/navigation"

export default async function ApplicationsPage(){
    const user=await TokenVerification()
    if(!user){
        redirect("/login")
    }
    return(
        <ApplicationsComponent/>
    )
}

