export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import BountyApplicationServiceInstance from "@/service/BountyApplicationService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserWithId } from "../../auth/github/route";

export async function GET(request:Request,{params}:{params:{id:string}}){
    try {
        const {id}=params
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId;
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        // const bountyApplications=await BountyApplicationServiceInstance.getBountyApplicationsForUser(user.id)
        const bountyApplications=await BountyApplicationServiceInstance.getBountyApplicationByUser(user.id,id)
        console.log(bountyApplications)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],bountyApplications:bountyApplications??[]}, {status:HttpStatus.OK})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}


//create a bounty application model stuff and all and formSchema as well
export async function POST(request:Request,{params}:{params:{id:string}}){
    try {
        
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const {id:bountyId}=params
        if(!bountyId){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const newbountyApplication=await BountyApplicationServiceInstance.addBountyApplication({bountyId:new mongoose.Types.ObjectId(bountyId),status:"pending",applicantId:new mongoose.Types.ObjectId(user.id)})
        if(!newbountyApplication){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]},{status:HttpStatus.CONFLICT})  //return conflict if the bounty is already applied by the user or the bounty does not exist  //this should be handled in the service layer instead of here, but for simplicity I am returning it here as well  //in real world application you should have a separate endpoint for checking if the bounty is already applied by the user or not and return 409 (Conflict) instead of 400 (Bad Request)  //this error handling should be in the service layer instead of here, but for simplicity I am returning it here as well  //in real world application you should have a separate endpoint for checking if the bounty is already applied by the user or not and return 409 (Conflict) instead of 400 (Bad Request)  //this error handling should be in the
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],application:newbountyApplication},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

