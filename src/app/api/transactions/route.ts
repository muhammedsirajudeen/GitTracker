import { HttpStatusMessage, HttpStatus } from "@/lib/HttpStatus"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Logger from "@/lib/LoggerHelper"
import TransactionServiceInstance from "@/service/TransactionService"
import { UserWithId } from "../auth/github/route"
import { TransactionSchema } from "@/lib/formSchema"
export async function GET(request:NextRequest){
    try {
        const {searchParams}=new URL(request.url)
        const page=searchParams.get('page')??"0"
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user || user.role!=="admin"){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        //fetch all users
        const transactions=await TransactionServiceInstance.getTransactionsByUserId(user.id,parseInt(page))
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],transactions:transactions},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}

export async function POST(request:Request){
    try {
        const user=await GetUserGivenAccessToken(cookies()) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const transaction=await request.json()
        try {
            TransactionSchema.parse(transaction)
        } catch (error) {
            const parseError=error as Error
            Logger._logger.error(parseError.message)
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        //successfully parsed it
        transaction.userId=user.id
        const newTransaction=await TransactionServiceInstance.createTransaction(transaction)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.CREATED],transaction:newTransaction},{status:HttpStatus.CREATED})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}