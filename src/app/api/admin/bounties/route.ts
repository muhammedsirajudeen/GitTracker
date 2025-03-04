export const dynamic = "force-dynamic";

import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { cookies } from "next/headers";
import BountyServiceInstance from "@/service/BountyService";
export async function GET(request:NextRequest){
    try {
        const {searchParams}=new URL(request.url)
        const page=searchParams.get('page')??"0"
        Logger._logger.info(request.url)
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }

        //fetch all bounties
        const bounties=await BountyServiceInstance.getAdminBounties(parseInt(page))
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bounties:bounties},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}