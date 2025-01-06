import RepoRepositoryInstance from "@/app/repository/RepoRepository";
import { verifyToken } from "@/lib/jwtHelper";
import { NextRequest, NextResponse } from "next/server";
import { UserWithId } from "../auth/github/route";
import { Repository } from "@/models/Repository";
import mongoose from "mongoose";
import RepositoryServiceInstance from "@/service/RepositoryService";
import axios from "axios";


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
        const githubApiUrl = 'https://api.github.com/user/repos?visibility=all&per_page=100';
        try {
            const response = await axios.get(githubApiUrl, {
                headers: {
                    Authorization: `token ${github_token}`,
                    Accept: 'application/vnd.github+json',
                },
            });
            const returnResponse = NextResponse.json({ message: 'success', repositories: response.data ?? [] }, { status: 200 })
            returnResponse.headers.set('Cache-Control', 'no-store')
            return returnResponse

        } catch (error) {
            console.log(error)
            return NextResponse.json(
                { message: 'Failed to fetch repositories', error },
                { status: 500 }
            );
        }
        // Fetch repositories
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'internal server error occured' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookies = request.headers.get('cookie')
        if (!cookies) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 500 })
        }
        const parsedCookies = Object.fromEntries(
            cookies.split('; ').map((cookie) => cookie.split('='))
        );
        const access_token = parsedCookies['access_token'] as string
        const decodedUser = verifyToken(access_token) as UserWithId
        console.log(decodedUser)
        const repoRequest = await request.json()
        const repository = repoRequest.repository as Repository
        repository.owner_id = new mongoose.Types.ObjectId(decodedUser.id)
        const existStatus = await RepositoryServiceInstance.getRepoByFullName(repository.full_name, decodedUser.id)
        //this would lead to conflict
        if (existStatus) {
            return NextResponse.json({ message: 'repo already saved' }, { status: 409 })
        }
        const newRepository = await RepoRepositoryInstance.addRepo(repository)
        if (!newRepository) {
            return NextResponse.json({ message: 'internal server error occured' }, { status: 500 })
        }
        return NextResponse.json({ message: 'success',repository:newRepository }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'internal server error occured' }, { status: 501 })
    }
}

