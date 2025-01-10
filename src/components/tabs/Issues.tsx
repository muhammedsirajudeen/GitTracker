'use client'

import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import { HttpStatus } from "@/lib/HttpStatus"
import LinkGithub from "../custom/LinkGithub"
import { useParams } from "next/navigation"
import { Edit, FolderX, Heart, Link, MessageSquare, SearchX, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Button } from "../ui/button"
import { GitHubIssue } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import IssueForm from "../form/IssueForm"
import DeleteIssue from "../delete/DeleteIssue"

interface IssueResponse {
    status: number
    message: string
    issues: GitHubIssue[]
}



export default function Issues() {
    const [expandedIssue, setExpandedIssue] = useState<number | null>(null)
    const { id } = useParams()
    const { data, isLoading }: { data: IssueResponse, isLoading: boolean } | undefined = useSWR(`/api/issues/${id}`, fetcher)
    const [issues, setIssues] = useState<GitHubIssue[]>([])
    const [issue,setIssue]=useState<GitHubIssue>()
    const [open, setOpen] = useState<boolean>(false)
    const [deleteopen, setDeleteopen] = useState<boolean>(false)
    const [issuenumber, setIssuenumber] = useState<number>(0)
    const [method, setMethod] = useState<string>("POST")
    const [page, setPage] = useState<number>(0)
    const toggleExpand = (issueId: number) => {
        setExpandedIssue(expandedIssue === issueId ? null : issueId)
    }
    useEffect(() => {
        setIssues(data?.issues ?? [])
    }, [data?.issues])

    function prevHandler() {
        setPage(prev => {
            const nextpage = prev - 1 < 0 ? 0 : prev - 1
            return nextpage
        })
    }
    function nextHandler() {
        setPage(prev => {
            const nextpage = prev + 1
            return nextpage
        })
    }
    function issueHandler(issue:GitHubIssue){
        setMethod('PUT')
        setIssue(issue)
        setOpen(true)
        
    }
    return (
        <div className="flex flex-col items-center justify-center w-full">

            {!isLoading && <Button onClick={() => {
                setOpen(true)
                setIssue(undefined)
            }} >Add Issue</Button>}
            {
                !isLoading && issues.length === 0 && data?.status !== HttpStatus.UNPROCESSABLE_ENTITY && (
                    <div className="flex flex-col items-center justify-center mt-20 ">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
                            <SearchX className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            No Issues Found
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                            We couldnt find any issues matching your criteria. Ty adjusting your search or filters.
                        </p>
                    </div>
                )
            }
            <IssueForm open={open} setOpen={setOpen} setIssues={setIssues} issue={issue} method={method} />
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
                    <div className="space-y-4 flex items-center justify-start flex-col w-full ">

                        {issues.map((issue) => (
                            <Card key={issue.id} className="w-3/4 mt-4 p-1 ">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <CardTitle className="text-base font-semibold">{issue.title}</CardTitle>
                                            <Badge variant={issue.state === 'open' ? 'default' : 'secondary'}>
                                                {issue.state}
                                            </Badge>
                                        </div>
                                        <span className="text-sm text-muted-foreground">#{issue.number}</span>
                                    </div>
                                    <CardDescription className="text-sm">
                                        Opened by {issue.user.login} on {new Date(issue.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <div className="flex items-center space-x-2 ">
                                        <Avatar>
                                            <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} className="h-8 w-8 rounded-full" />
                                            <AvatarFallback>{issue.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{issue.user.login}</span>
                                    </div>
                                    <p className={`text-sm ${expandedIssue === issue.id ? '' : 'line-clamp-2'}`}>
                                        {issue.body}
                                    </p>
                                    {issue.body && issue.body.length > 100 && (
                                        <Button variant="link" size="sm" onClick={() => toggleExpand(issue.id)}>
                                            {expandedIssue === issue.id ? 'Show less' : 'Show more'}
                                        </Button>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between text-xs">
                                    <div className="flex items-center space-x-2">
                                        <span className="flex items-center space-x-1">
                                            <MessageSquare className="w-3 h-3" />
                                            <span>{issue.comments}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <ThumbsUp className="w-3 h-3" />
                                            <span>{issue.reactions['+1']}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <ThumbsDown className="w-3 h-3" />
                                            <span>{issue.reactions['-1']}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Heart className="w-3 h-3" />
                                            <span>{issue.reactions.heart}</span>
                                        </span>
                                    </div>
                                    <div className="flex space-x-1">
                                        {issue.labels.map((label, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">{label}</Badge>
                                        ))}
                                    </div>
                                    <Button onClick={() => {
                                        setDeleteopen(true)
                                        setIssuenumber(issue.number)

                                    }} variant="outline" size="sm" className="ml-auto rounded-full h-10 w-10">
                                        <X className="w-2 h-2" />
                                    </Button>
                                    <Button onClick={()=>issueHandler(issue)} variant="outline" size="sm"  className="ml-4 rounded-full h-10 w-10" >
                                        <Edit  />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )
            }
            <DeleteIssue setIssues={setIssues} issueNumber={issuenumber} open={deleteopen} setOpen={setDeleteopen} />
            <Pagination className="fixed bottom-0" >
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={prevHandler} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink onClick={() => setPage(page + 2)}>{page + 2}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink onClick={() => setPage(page + 3)}>{page + 3}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={nextHandler} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div>
    )
}