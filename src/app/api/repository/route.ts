import { verifyToken } from "@/lib/jwtHelper";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {

        const cookies = request.headers.get('cookie')
        if (!cookies) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 500 })
        }
        const parsedCookies = Object.fromEntries(
            cookies.split('; ').map((cookie) => cookie.split('='))
        );
        const access_token = parsedCookies['access_token'] as string
        const github_token = parsedCookies['github_token'] as string
        verifyToken(access_token)
        //according to control flow this would fail
        if (!github_token) {
            return NextResponse.json({ message: 'github token missing' }, { status: 401 })
        }
        const githubApiUrl = 'https://api.github.com/user/repos';

        // Fetch repositories
        const response = await fetch(githubApiUrl, {
            headers: {
                Authorization: `Bearer ${github_token}`,
                Accept: 'application/vnd.github+json',
            },
        });
        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { message: 'Failed to fetch repositories', error },
                { status: response.status }
            );
        }
        const repositories = await response.json();
        console.log(repositories)
        return NextResponse.json({ message: 'success', repositories }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'internal server error occured' }, { status: 500 })
    }
}