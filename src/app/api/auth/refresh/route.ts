export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { generateToken, verifyToken } from "@/lib/jwtHelper"
import { RedisOtpGetter, RedisOtpHelper } from "@/lib/redisHelper"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { UserWithId } from "../github/route"

export async function GET() {
    try {
        const cookie = cookies()
        const access_token = cookie.get('access_token')
        const refresh_token = cookie.get('refresh_token')
        if (!access_token || !refresh_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        const decodedUser = await verifyToken(access_token.value) as UserWithId
        console.log(decodedUser)
        if (!decodedUser) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        const refresh_cached = await RedisOtpGetter(decodedUser.email, 'refresh')
        console.log(refresh_cached)
        if (!refresh_cached || refresh_cached !== refresh_token.value) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        const response = NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK] }, { status: HttpStatus.OK })
        const accessTokenPayload =await generateToken({ email: decodedUser.email, id: decodedUser.id }, '5m')
        const refreshTokenPayload = await generateToken({ email: decodedUser.email, id: decodedUser.id }, '1d')
        await RedisOtpHelper(decodedUser.email, 'refresh')
        response.cookies.set('access_token', accessTokenPayload, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });
        response.cookies.set('refresh_token', refreshTokenPayload, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });
        return response
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}