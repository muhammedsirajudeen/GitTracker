"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { format } from "date-fns"
import { ChevronDown, ChevronUp, MessageCircle, ThumbsUp } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetcher } from "../RepositoryListing"
import type { GitHubIssue } from "@/lib/types"

interface ClosedIssuesProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface ClosedIssueResponse {
  status: number
  message: string
  closedIssues: GitHubIssue[]
}

export default function ClosedIssues({ open, setOpen }: ClosedIssuesProps) {
  const { id } = useParams()
  const { data, isLoading } = useSWR<ClosedIssueResponse>(`/api/issues/closed/${id}`, fetcher)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 text-white max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Closed Issues</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Review and analyze closed issues for this repository
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <IssuesSkeleton />
          ) : data?.closedIssues?.length ? (
            <IssuesList issues={data.closedIssues} />
          ) : (
            <p className="text-center text-zinc-500 py-8">No closed issues found.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function IssuesList({ issues }: { issues: GitHubIssue[] }) {
  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}

function IssueCard({ issue }: { issue: GitHubIssue }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 cursor-pointer flex items-start justify-between" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} />
            <AvatarFallback>{issue.user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{issue.title}</h3>
            <p className="text-sm text-zinc-400">
              #{issue.number} closed on {format(new Date(issue.closed_at!), "MMM d, yyyy")} by {issue.user.login}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-zinc-300 mb-4">{issue.body}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">{issue.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-500">{Object.values(issue.reactions).reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {issue.labels.map((label) => (
              <Badge key={label} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function IssuesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-zinc-800 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

