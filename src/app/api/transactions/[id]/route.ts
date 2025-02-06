import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import Logger from "@/lib/LoggerHelper"
import TransactionServiceInstance from "@/service/TransactionService"
import { isObjectIdOrHexString } from "mongoose"
import { NextResponse } from "next/server"

//transaction that has only been successful i dont know if we would need failed transactions
export async function DELETE(request:Request,{params}:{params:{id:string}}){
    try {
        const {id}=params
        if(!isObjectIdOrHexString(id)){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.BAD_REQUEST]},{status:HttpStatus.BAD_REQUEST})
        }
        const deletionStatus=await TransactionServiceInstance.deleteTransaction(id)
        console.log(deletionStatus)
        if(!deletionStatus){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.CONFLICT]},{status:HttpStatus.CONFLICT})
        }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    } catch (error) {
        const controllerError=error as Error
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}