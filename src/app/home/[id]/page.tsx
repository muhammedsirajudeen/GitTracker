import RepoPage from "@/components/RepoPageComponent";
import { redirect } from "next/navigation";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { cookies } from "next/headers";

export default async  function Page(){
    const user=await GetUserGivenAccessToken(cookies())
    if(!user){
      redirect('/')
    }
    return(
        <RepoPage/>
    )
}