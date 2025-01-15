'use client'

import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { useParams } from "next/navigation"
import { BountyApplication } from "@/models/BountyApplication"
import { useEffect, useState } from "react"
import { User } from "@/models/User"
import { Bounty } from "@/models/Bounty"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import axios, { AxiosError } from "axios"
import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { toast } from "@/hooks/use-toast"
import { UserWithId } from "@/app/api/auth/github/route"
import { BountyWithId } from "./tabs/Bounties"
import AssignDialog from "./dialog/AssignDialog"


export interface BountyApplicationWithId extends Omit<BountyApplication, "applicantId" | "bountyId"> {
  _id: string
  applicantId: UserWithId
  bountyId: BountyWithId
}

interface BountyApplicationResponse {
  status: number
  bountyApplications: BountyApplicationWithId[]
}

export default function ApplicationsComponent() {
  const { id } = useParams()
  const { data, isLoading }: { data?: BountyApplicationResponse; isLoading: boolean } = useSWR(
    `/api/application/${id}`,
    fetcher
  )
  const [open,setOpen]=useState<boolean>(false)
  const [bountyApplications, setBountyApplications] = useState<BountyApplicationWithId[]>([])
  const [bountyApplication,setBountyApplication] = useState<BountyApplicationWithId>()
  useEffect(() => {
    setBountyApplications(data?.bountyApplications ?? [])
  }, [data?.bountyApplications, setBountyApplications])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-10 w-10 rounded-full mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (bountyApplications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No applications found for this bounty.</p>
        </CardContent>
      </Card>
    )
  }
  async function assignHandler(bountyApplication:BountyApplicationWithId){
    //here send an api call add a confirm dialog and just send and finish this
    setBountyApplication(bountyApplication)
    setOpen(true)

  }

  return (
    //dont forget to add pagination here and things like that
    <div className="w-screen flex items-center justify-center mt-4">
        <AssignDialog open={open} setOpen={setOpen} />
      {bountyApplications.map((bountyApplication) => (
        <Card key={bountyApplication._id} className="w-3/4" >
          <CardHeader>
            <CardTitle className="text-lg">Application ID: {bountyApplication._id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                    <AvatarImage src={bountyApplication.applicantId.avatar_url}/>
                    <AvatarFallback>{bountyApplication.applicantId.email.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
              <div>
                <p className="font-medium">{bountyApplication.applicantId.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Bounty Amount: ${bountyApplication.bountyId.bountyAmount}</p>
              <p className="text-sm">{bountyApplication.bountyId.description}</p>
            </div>
            
          </CardContent>
          <CardFooter>
            <Button onClick={()=>assignHandler(bountyApplication)} variant={"outline"} >Assign</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

