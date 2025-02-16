export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { UserWithId } from "../auth/github/route"
import BountyApplicationServiceInstance from "@/service/BountyApplicationService"

export async function GET(){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const applications=await BountyApplicationServiceInstance.getBountyApplicationByApplicant(user.id)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],applications:applications??[]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}