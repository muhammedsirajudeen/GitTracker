export const dynamic = "force-dynamic";

import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { verifyToken } from "@/lib/jwtHelper"
import { mintNFT } from "@/lib/mintHelper"
import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import RepositoryServiceInstance from "@/service/RepositoryService"
import axios from "axios"
import { Issue } from "next/dist/build/swc"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const searchParams = new URL(request.url).searchParams
        const page = searchParams.get('page') ?? "1"
        const search = searchParams.get('search') ?? ""
        console.log(search)
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }

        const cookie = cookies()
        const access_token = cookie.get('access_token')
        const github_token = cookie.get('github_token')
        if (!access_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        if (!github_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY] }, { status: HttpStatus.UNPROCESSABLE_ENTITY })
        }
        const repository = await RepositoryServiceInstance.getRepoById(id)
        if (!repository) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND })
        }
        const decodedUser = await verifyToken(access_token.value)
        if (!decodedUser) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED })
        }
        const userResponse = await axios.get("https://api.github.com/user",
            {
                headers: {
                    Authorization: `token ${github_token.value}`
                }
            }
        )
        const username = userResponse.data.login
        if (search) {
            const url = `https://api.github.com/search/issues?q=repo:${username}/${repository.name}+is:issue+state:open+${search}+in:title,body,comments&page=${page}&per_page=10`;
            const headers = {
                Authorization: `token ${github_token.value}`,
                Accept: "application/vnd.github.v3+json",
            };
            const issueResponse = await axios.get(url, { headers })
            const issues = issueResponse.data.items as Issue[]
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK], issues: issues ?? [] }, { status: HttpStatus.OK })
        }
        const url = `https://api.github.com/repos/${username}/${repository.name}/issues?page=${page}&per_page=10`;
        const headers = {
            Authorization: `token ${github_token.value}`,
            Accept: "application/vnd.github.v3+json",
        };
        const issueResponse = await axios.get(url, { headers })
        const issues = issueResponse.data as Issue[]
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK], issues: issues ?? [] }, { status: HttpStatus.OK })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}


export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json();
        const { title, description: issueBody } = body;
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }

        const cookie = cookies();
        const access_token = cookie.get('access_token');
        const github_token = cookie.get('github_token');
        if (!access_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED });
        }
        if (!github_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY] }, { status: HttpStatus.UNPROCESSABLE_ENTITY });
        }

        const decodedUser = await verifyToken(access_token.value);
        if (!decodedUser) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED });
        }

        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${github_token.value}`
            }
        });

        const username = userResponse.data.login;
        const repository = await RepositoryServiceInstance.getRepoById(id);
        if (!repository) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND })
        }
        const url = `https://api.github.com/repos/${username}/${repository.name}/issues`;
        const headers = {
            Authorization: `token ${github_token.value}`,
            Accept: "application/vnd.github.v3+json",
        };
        console.log("the issue", issueBody)
        const issueResponse = await axios.post(url, { title, body: issueBody }, { headers });
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.CREATED], issue: issueResponse.data }, { status: HttpStatus.CREATED });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { issueNumber,walletAddress } = body;
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }
        const cookie = cookies();
        const access_token = cookie.get('access_token');
        const github_token = cookie.get('github_token');
        if (!access_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED });
        }
        if (!github_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY] }, { status: HttpStatus.UNPROCESSABLE_ENTITY });
        }

        const decodedUser = await verifyToken(access_token.value);
        if (!decodedUser) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED });
        }

        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${github_token.value}`
            }
        });

        const username = userResponse.data.login;
        const repository = await RepositoryServiceInstance.getRepoById(id);
        if (!repository) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND });
        }

        const url = `https://api.github.com/repos/${username}/${repository.name}/issues/${issueNumber}`;
        const headers = {
            Authorization: `token ${github_token.value}`,
            Accept: "application/vnd.github.v3+json",
        };
        //create a way to keep track of the amount of issues closed in this repository either by adding a field to the repository model or by creating a new model
        await axios.patch(url, { "state": "closed" }, { headers });
        await RepositoryServiceInstance.increaseClosedIssuesCount(id);
        //right now mint here later pass the wallet address 
        const nftAddress=await mintNFT(walletAddress)
        console.log(nftAddress)
        if(!nftAddress){
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
        }
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK],nft:nftAddress }, { status: HttpStatus.OK });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { issueNumber, title, description: issueBody } = body;
        console.log(issueNumber, title, issueBody);
        const cookie = cookies();
        const user=await GetUserGivenAccessToken(cookies())
        if(!user){
            return NextResponse.json({message:HttpStatusMessage[HttpStatus.UNAUTHORIZED]},{status:HttpStatus.UNAUTHORIZED})
        }

        const access_token = cookie.get('access_token');
        const github_token = cookie.get('github_token');
        if (!access_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED });
        }
        if (!github_token) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNPROCESSABLE_ENTITY] }, { status: HttpStatus.UNPROCESSABLE_ENTITY });
        }

        const decodedUser = await verifyToken(access_token.value);
        if (!decodedUser) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.UNAUTHORIZED] }, { status: HttpStatus.UNAUTHORIZED });
        }

        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${github_token.value}`
            }
        });

        const username = userResponse.data.login;
        const repository = await RepositoryServiceInstance.getRepoById(id);
        if (!repository) {
            return NextResponse.json({ message: HttpStatusMessage[HttpStatus.NOT_FOUND] }, { status: HttpStatus.NOT_FOUND });
        }
        console.log(username, repository.name, issueNumber)
        const url = `https://api.github.com/repos/${username}/${repository.name}/issues/${issueNumber}`;
        const headers = {
            Authorization: `token ${github_token.value}`,
            Accept: "application/vnd.github.v3+json",
        };
        const issueResponse = await axios.patch(url, { title, body: issueBody }, { headers });
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.OK], issue: issueResponse.data }, { status: HttpStatus.OK });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}