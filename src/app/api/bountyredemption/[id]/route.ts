import {NextResponse} from "next/server";
import {HttpStatus, HttpStatusMessage} from "@/lib/HttpStatus";
import Logger from "@/lib/LoggerHelper";
import BountyRedemptionServiceInstance from "@/service/BountyRedemption";

export async function GET(req:Request,{params}:{params:{id:string}}){
    try {
        const {id:bountyId}=params
        const bountyRedemption=await BountyRedemptionServiceInstance.getBountyRedemptionById(bountyId)
        if(!bountyRedemption){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bountyredemption:bountyRedemption},{status:HttpStatus.OK})
    }catch (e) {
        const controllerError=e as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}