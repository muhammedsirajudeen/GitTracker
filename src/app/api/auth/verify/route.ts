import { verifyToken } from "@/lib/jwtHelper"
import UserServiceInstance from "@/service/UserService"
import { parse } from "cookie"
import { NextResponse } from "next/server"

export  async function GET(request:Request){
    try {
        const cookies=parse(request.headers.get('cookie')||'')
        const access_token=cookies['access_token']
        const decodedUser=await verifyToken(access_token ?? "")
        if(!decodedUser){
            return NextResponse.json({message:'unauthorized'},{status:401})
        }
        //exclude password from here
        const user=await UserServiceInstance.getUserByEmail(decodedUser?.email)
        return NextResponse.json({message:'success',user},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:'internal server error occured'},{status:500})
    }
}