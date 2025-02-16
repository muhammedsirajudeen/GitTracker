export const dynamic = "force-dynamic";

import { verifyPassword } from "@/lib/bcryptHelper"
import { generateToken } from "@/lib/jwtHelper"
import UserServiceInstance from "@/service/UserService"
import { NextResponse } from "next/server"
import { UserWithId } from "../github/route"
import { RedisOtpHelper } from "@/lib/redisHelper"
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { loginFormSchema } from "@/lib/formSchema"
import Logger from "@/lib/LoggerHelper"

interface LoginRequest {
    email: string
    password: string
}

export async function POST(request: Request) {
    try {
        const loginRequest = await request.json() as LoginRequest
        const {email,password}=loginRequest
        try {
            loginFormSchema.parse({email,password})
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.BAD_REQUEST]}, { status: HttpStatus.BAD_REQUEST })
        }
        const user = await UserServiceInstance.getUserByEmail(loginRequest.email) as UserWithId
        if (!user) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND })
        }
        else if (user.verified === false) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        const verify = await verifyPassword(loginRequest.password, user.password)
        console.log(verify)
        if (!verify) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        //from here change the flow of the token if admin go with a flow
        const token = generateToken({ email: user.email, id: user.id })

        const response = NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK], token }, { status: HttpStatus.OK });

        response.cookies.set('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        });
        const refresh_token=generateToken({email:user.email,id:user.id},'1d')
        //adding refresh token to the cache
        await RedisOtpHelper(user.email,refresh_token,'refresh')
        response.cookies.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        });
        Logger._logger.info('User logged in successfully')
        return response;
    } catch (error) {
        console.log(error)
        const errorLogin=error as Error
        Logger._logger.error(errorLogin.message)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
