import { NextResponse } from "next/server";
import { parse } from "cookie"
import { verifyToken } from "@/lib/jwtHelper";
import { User } from "@/models/User";
import RepositoryServiceInstance from "@/service/RepositoryService";

interface ExtendedUser extends User {
    id: string
}

export async function GET(request: Request) {
    try {
        const cookies = parse(request.headers.get('cookie') || '')
        const access_token = cookies['access_token'] ?? ""
        const user = verifyToken(access_token) as ExtendedUser
        console.log(user)
        if (!user) {
            return NextResponse.json({ message: 'invalid token' }, { status: 401 })
        }
        const repositories = await RepositoryServiceInstance.getRepoByUser(user.id)
        const response = NextResponse.json({ message: 'success', repositories: repositories })
        response.headers.set('Cache-Control', 'no-store')
        return response
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Server error occured' }, { status: 500 })
    }
}

