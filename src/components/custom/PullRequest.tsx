"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import { FileIcon, GitPullRequestIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PopulatedBounty } from "../BountyPageComponent"
import axios, { AxiosError } from "axios"
import { HttpStatus } from "@/lib/HttpStatus";
import useSWR from "swr";
import { fetcher } from "@/components/RepositoryListing";
import { BountyRedemption } from "@/models/BountyRedemption";

interface User {
    login: string
    avatar_url: string
}

interface PullRequest {
    id: number
    number: number
    state: string
    locked: boolean
    title: string
    body: string | null
    created_at: string
    updated_at: string
    closed_at: string | null
    merged_at: string | null
    html_url: string
    user: User
    draft: boolean
}

interface PullRequestListProps {
    pullRequests: PullRequest[]
    bounty: PopulatedBounty | undefined
}
interface BountyRedemptionResponse {
    bountyredemption: BountyRedemption | null
    status: number

}


export default function PullRequestList({ pullRequests, bounty }: PullRequestListProps) {
    const { data: bountyredemptiondata }: { data: BountyRedemptionResponse, isLoading: boolean } = useSWR(`/api/bountyredemption/${bounty?._id}`, fetcher)
    const [bountyredemption, setBountyRedemption] = useState<Partial<BountyRedemption> | null>(null)

    useEffect(() => {
        if (bountyredemptiondata) {
            setBountyRedemption((bountyredemptiondata.bountyredemption))
        }
    }, [bountyredemptiondata]);
    const [expandedPR, setExpandedPR] = useState<number | null>(null)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getStateBadge = (state: string, draft: boolean) => {
        if (draft) return <Badge variant="outline">Draft</Badge>
        switch (state) {
            case "open":
                return (
                    <Badge variant="default" className="bg-green-500">
                        Open
                    </Badge>
                )
            case "closed":
                return <Badge variant="destructive">Closed</Badge>
            default:
                return <Badge variant="secondary">{state}</Badge>
        }
    }
    async function selectHandler(pullrequest: PullRequest) {
        try {
            toast({ description: "pr selected succesfully", className: "bg-orange-500 text-white" })
            //here we would post to the backend and we would award the first closed issue in case of arising conflicts we would assign 
            console.log(bounty?._id, bounty?.repositoryId.full_name, pullrequest.number)

            await axios.post(`/api/bountyredemption`, { bountyId: bounty?._id, fullName: bounty?.repositoryId.full_name, pullrequestNumber: pullrequest.number }, { withCredentials: true })

            setBountyRedemption({ pullrequestNumber: pullrequest.number })

        } catch (error) {
            const axiosError = error as AxiosError
            if (axiosError.status === HttpStatus.CONFLICT) {
                toast({ description: "The bounty has already been claimed", className: "bg-red-500 text-white" })
            } else {
                toast({ description: "Failed to select pr", className: "bg-red-500 text-white" })
            }
        }
    }

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>Pull Requests</CardTitle>
                <CardDescription>List of recent pull requests</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                    {
                        pullRequests.length === 0 &&
                        (
                            <Card className="w-full max-w-md mx-auto">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <GitPullRequestIcon className="w-6 h-6" />
                                        <span>No Pull Requests</span>
                                    </CardTitle>
                                    <CardDescription>There are currently no open pull requests in this repository.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center space-y-4">
                                    <FileIcon className="w-16 h-16 text-muted-foreground" />
                                    <p className="text-center text-sm text-muted-foreground">
                                        Pull requests help you collaborate on code with others. As pull requests are opened, they&apos;ll appear here.
                                    </p>
                                    <Button asChild>
                                        <Button disabled={true} >Create a pull request</Button>
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    }
                    {pullRequests.map((pr) => (
                        <Card key={pr.id} className="mb-4">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    #{pr.number} {pr.title}
                                </CardTitle>
                                {getStateBadge(pr.state, pr.draft)}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={pr.user.avatar_url} alt={pr.user.login} />
                                        <AvatarFallback>{pr.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span>{pr.user.login}</span>
                                    <span>Created: {formatDate(pr.created_at)}</span>
                                    <span>Updated: {formatDate(pr.updated_at)}</span>
                                </div>
                                {expandedPR === pr.id && (
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">{pr.body || "No description provided."}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setExpandedPR(expandedPR === pr.id ? null : pr.id)}
                                    className="mt-2 text-sm text-blue-500 hover:underline"
                                >
                                    {expandedPR === pr.id ? "Show less" : "Show more"}
                                </button>
                            </CardContent>
                            <CardFooter>
                                {
                                    bountyredemption?.pullrequestNumber === pr.number
                                        ?
                                        <Button onClick={() => {
                                            toast({ description: "Please select a different pr to change", className: "bg-orange-500 text-white" })
                                        }} variant="outline">selected</Button>
                                        :
                                        <Button className="h-6" onClick={() => selectHandler(pr)} >
                                            select
                                        </Button>
                                }
                            </CardFooter>
                        </Card>
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}
