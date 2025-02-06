import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import Logger from "@/lib/LoggerHelper"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { NextResponse } from "next/server"
import { UserWithId } from "../../auth/github/route"
import { cookies } from "next/headers"
import TransactionServiceInstance from "@/service/TransactionService"

export async function GET(request:Request){
    try {
        const {searchParams}=new URL(request.url)
        const page=searchParams.get('page')??"0"
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const transactions=await TransactionServiceInstance.getAllTransactions(parseInt(page))
        return NextResponse.json({message:HttpStatus.OK,transactions:transactions},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}