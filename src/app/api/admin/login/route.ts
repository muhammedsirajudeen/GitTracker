import {AxiosError} from "axios";
import Logger from "@/lib/LoggerHelper";
import {NextResponse} from "next/server";
import {HttpStatus, HttpStatusMessage} from "@/lib/HttpStatus";
import {adminFormSchema} from "@/lib/formSchema";

export async function POST(request:Request){
    try {
        const {email, password} = await request.json();
        try {
            adminFormSchema.parse({email,password})
        }catch (e) {
            const formError=e as Error
            Logger._logger.error(formError.message)
        }
        //check the user service here check if its admin if its admin and also password is correct then
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
    }catch (e) {
        const controllerError=e as AxiosError
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}