import RepoPage from "@/components/RepoPageComponent";
import { TokenVerification } from "../page";
import { redirect } from "next/navigation";

export default async  function Page(){
    const token=await TokenVerification()
    if(!token){
      redirect('/')
    }
    return(
        <RepoPage/>
    )
}