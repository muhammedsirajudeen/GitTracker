export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import BountyServiceInstance from "@/service/BountyService"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { UserWithId } from "../auth/github/route"

export async function GET(){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const bounties=await BountyServiceInstance.getAllBounties(user.id)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bounties:bounties??[]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}