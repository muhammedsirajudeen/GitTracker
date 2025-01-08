'use client'

import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import { HttpStatus } from "@/lib/HttpStatus"
import LinkGithub from "../custom/LinkGithub"
import { useParams } from "next/navigation"
import { FolderX, Heart, Link, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "../ui/button"
import { GitHubIssue } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "../ui/avatar"
import { useState } from "react"
import { Skeleton } from "../ui/skeleton"

interface IssueResponse {
    status: number
    message: string
    issues: GitHubIssue[]
}


export default function Issues() {
    const [expandedIssue, setExpandedIssue] = useState<number | null>(null)

    const toggleExpand = (issueId: number) => {
        setExpandedIssue(expandedIssue === issueId ? null : issueId)
    }

    const { id } = useParams()
    const { data, isLoading }: { data: IssueResponse, isLoading: boolean } | undefined = useSWR(`/api/issues/${id}`, fetcher)
    return (
        <>
            {data?.status === HttpStatus.UNPROCESSABLE_ENTITY && (
                <LinkGithub />
            )
            }
            {
                data?.status === HttpStatus.NOT_FOUND && (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
                        <FolderX className="w-16 h-16 mb-4 text-muted-foreground" />
                        <h1 className="text-3xl font-bold mb-2">Repository Not Found</h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            The repository youre looking for doesnt exist or you dont have access to it.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard">
                                Go Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                )
            }
            {isLoading && (
                
                <div className="flex flex-col items-center justify-center mt-10 ">
                    {
                        new Array(10).fill(0).map((_, index) => (
                            <div key={index} className="flex items-center space-x-4 mt-20">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-[700px]" />
                                    <Skeleton className="h-6 w-[700px]" />
                                </div>
                            </div>
                        ))
                    }
                    </div>            
            )}
            {
                data?.status === HttpStatus.OK && (
                    <div className="space-y-4 flex items-center justify-center flex-col">
                        {data.issues.map((issue) => (
                            <Card key={issue.id} className="w-3/4 h-auto mt-4">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <CardTitle className="text-lg font-bold">{issue.title}</CardTitle>
                                            <Badge variant={issue.state === 'open' ? 'default' : 'secondary'}>
                                                {issue.state}
                                            </Badge>
                                        </div>
                                        <span className="text-muted-foreground">#{issue.number}</span>
                                    </div>
                                    <CardDescription>
                                        Opened by {issue.user.login} on {new Date(issue.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Avatar>
                                            <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} className="h-10 w-10 rounded-full" />
                                            <AvatarFallback>{issue.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{issue.user.login}</span>
                                    </div>
                                    <p className={`text-sm ${expandedIssue === issue.id ? '' : 'line-clamp-3'}`}>
                                        {issue.body}
                                    </p>
                                    {issue.body && issue.body.length > 150 && (
                                        <Button variant="link" onClick={() => toggleExpand(issue.id)}>
                                            {expandedIssue === issue.id ? 'Show less' : 'Show more'}
                                        </Button>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="flex items-center space-x-1">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{issue.comments}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{issue.reactions['+1']}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <ThumbsDown className="w-4 h-4" />
                                            <span>{issue.reactions['-1']}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Heart className="w-4 h-4" />
                                            <span>{issue.reactions.heart}</span>
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {issue.labels.map((label, index) => (
                                            <Badge key={index} variant="outline">{label}</Badge>
                                        ))}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )
            }
        </>
    )
}