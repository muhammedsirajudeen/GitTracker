export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import BountyRedemptionServiceInstance from "@/service/BountyRedemption";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Bounty from "@/models/Bounty";

export async function GET(){
    try {
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        //estabilished identity of user now send back bounty redemption and fix the flow's
        const bountyredemptions=await BountyRedemptionServiceInstance.getBountyRedemptions()
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bountyredemptions},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})        
    }
}