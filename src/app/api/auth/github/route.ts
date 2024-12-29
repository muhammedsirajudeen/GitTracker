import { NextRequest, NextResponse } from "next/server";
import axios from "axios"


export  async function GET(request:NextRequest){
    console.log(request.url)
    const searchParams=new URL(request.url).searchParams
    const code=searchParams.get("code")
    const response =( await axios.post('https://github.com/login/oauth/access_token',

        {
            "client_id":process.env.GITHUB_CLIENTID,
            "client_secret":process.env.GITHUB_SECRET,
            "code":code,
            "redirect_uri":process.env.REDIRECT_URI
        },
        {
            headers: {
              'Content-Type': 'application/json',  
              'Accept': 'application/json',         
            },
        }
    )).data
    console.log(response.access_token)
    const userResponse= (
        await axios.get("https://api.github.com/user",
            {
                headers:{
                    Authorization:`Bearer ${response.access_token}`
                }
            }
        )
    ).data
    console.log(userResponse)
    return NextResponse.json({message:'authentication succeeded'})
}