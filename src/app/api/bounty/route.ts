import BountyRepositoryInstance from "@/app/repository/BountyRepository"
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(){
    try {
        const user=GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const bounties=await BountyRepositoryInstance.getAllBounties()
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bounties:bounties??[]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}