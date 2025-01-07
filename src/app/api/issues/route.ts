import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export default function GET(){
    try {
        const cookie=cookies()
        const access_token=cookie.get('access_token')
        if(!access_token){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}