import {AxiosError} from "axios";
import Logger from "@/lib/LoggerHelper";
import {NextResponse} from "next/server";
import {HttpStatus, HttpStatusMessage} from "@/lib/HttpStatus";
import {adminFormSchema} from "@/lib/formSchema";
import UserServiceInstance from "@/service/UserService";
import { generateToken } from "@/lib/jwtHelper";
import { UserWithId } from "../../auth/github/route";

export async function POST(request:Request){
    try {
        const {email, password} = await request.json();
        try {
            adminFormSchema.parse({email,password})
        }catch (e) {
            const formError=e as Error
            Logger._logger.error(formError.message)
        }
        const verifyAdmin=await UserServiceInstance.verifyAdmin(email,password)
        if(!verifyAdmin){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        //check the user service here check if its admin if its admin and also password is correct then
        const response=NextResponse.json({message:HttpStatusMessage[HttpStatus.OK]},{status:HttpStatus.OK})
        const user=await UserServiceInstance.getUserByEmail(email) as UserWithId
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.NOT_FOUND]},{status:HttpStatus.NOT_FOUND})
        }
        const access_token=await generateToken({email:email,id:user.id,role:"admin"})
        const refresh_token=await generateToken({email:email,id:user.id,role:"admin"})
        response.cookies.set('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        response.cookies.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        return response

    }catch (e) {
        const controllerError=e as AxiosError
        Logger._logger.error(controllerError.message)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }
}