import { verifyPassword } from "@/lib/bcryptHelper"
import { generateToken } from "@/lib/jwtHelper"
import UserServiceInstance from "@/service/UserService"
import { NextResponse } from "next/server"
import { UserWithId } from "../github/route"
import { RedisOtpHelper } from "@/lib/redisHelper"

export async function POST(request: Request) {
    try {
        const loginRequest = await request.json()
        const user = await UserServiceInstance.getUserByEmail(loginRequest.email) as UserWithId
        if (!user) {
            return NextResponse.json({ message: 'user not found' }, { status: 404 })
        }
        else if (user.verified === false) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
        }
        const verify = await verifyPassword(loginRequest.password, user.password)
        console.log(verify)
        if (!verify) {
            return NextResponse.json({ message: 'invalid credentials' }, { status: 401 })
        }
        const token = generateToken({ email: user.email, id: user.id })
        const response = NextResponse.json({ message: 'Success', token }, { status: 200 });

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


        return response;
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'internal server error' }, { status: 500 })
    }
}