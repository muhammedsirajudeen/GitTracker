import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { BountyRedemption } from "@/models/BountyRedemption"
import BountyRedemptionServiceInstance from "@/service/BountyRedemption"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { UserWithId } from "../auth/github/route"
export async function POST(request:Request){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const requestBody:BountyRedemption=await request.json()
        //logic to redeem bounty goes here
        console.log(requestBody)
        const newBountyRedemption=await BountyRedemptionServiceInstance.addBountyRedemption({...requestBody,applicantId:user.id},user.id)
        console.log(newBountyRedemption)
        if(!newBountyRedemption){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]},{status:HttpStatus.CONFLICT})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}