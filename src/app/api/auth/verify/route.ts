export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
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
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        //exclude password from here
        const user=await UserServiceInstance.getUserByEmail(decodedUser?.email)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],user},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}