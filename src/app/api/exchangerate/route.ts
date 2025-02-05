import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/lib/LoggerHelper";
import { GetUserGivenAccessToken } from "@/lib/tokenHelper";
import { cookies } from "next/headers";
import axios from "axios";
export async function GET(request:NextRequest){
    try {
        Logger._logger.info(request.url)
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const response=await axios.get('https://api.coingecko.com/api/v3/simple/price\?ids\=solana\&vs_currencies\=inr')
        console.log(response.data)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],price:response.data.solana.inr},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}