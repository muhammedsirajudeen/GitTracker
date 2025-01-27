import { NextResponse } from "next/server";
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import BountyRedemptionServiceInstance from "@/service/BountyRedemption";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        
        const { id: bountyId } = params
        const bountyRedemption = await BountyRedemptionServiceInstance.getBountyRedemptionById(bountyId)
        if (!bountyRedemption) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND })
        }
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK], bountyredemption: bountyRedemption }, { status: HttpStatus.OK })
    } catch (e) {
        const controllerError = e as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const user=await GetUserGivenAccessToken(cookies())
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const { id } = params
        if (!isObjectIdOrHexString(id)) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.BAD_REQUEST] }, { status: HttpStatus.BAD_REQUEST })
        }
        //against repo pattern try to change it
        const bountyredemption = await BountyRedemptionServiceInstance.updateBountyRedemption({ bountyId: new mongoose.Types.ObjectId(id), status: "completed" })
        if (!bountyredemption) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.BAD_REQUEST] }, { status: HttpStatus.BAD_REQUEST })

        }
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK] }, { status: HttpStatus.OK })
    } catch (error) {
        const controllerError = error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}