'use client'
import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { useParams } from "next/navigation"
import { BountyApplication } from "@/models/BountyApplication"
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { UserWithId } from "@/app/api/auth/github/route"
import { BountyWithId } from "./tabs/Bounties"
import AssignDialog from "./dialog/AssignDialog"
import { Edit, Search } from "lucide-react"
import { Input } from "./ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import useGlobalStore from "@/store/GlobalStore"
import { User } from "@/models/User"
import { BlockChainProvider } from "./wallet/BlockChainProvider"

interface CustomBounty extends Omit<BountyWithId, "assignees"> {
  assignees: string[]
}
export interface BountyApplicationWithId extends Omit<BountyApplication, "applicantId" | "bountyId"> {
  _id: string
  applicantId: UserWithId
  bountyId: CustomBounty
}

interface BountyApplicationResponse {
  status: number
  bountyApplications: BountyApplicationWithId[]
}
interface UserWith_Id extends User {
  _id: string
}

export default function ApplicationsComponent() {
  const { id } = useParams()
  const { data, isLoading }: { data?: BountyApplicationResponse; isLoading: boolean } = useSWR(
    `/api/application/${id}`,
    fetcher
  )
  //semlly code
  const { user } = useGlobalStore()
  const [userid, setUserId] = useState("")
  useEffect(() => {
    if (user) {
      console.log(user)
      setUserId((user as UserWith_Id)._id)
    }
  }, [user])
  const [open, setOpen] = useState<boolean>(false)
  const [bountyApplications, setBountyApplications] = useState<BountyApplicationWithId[]>([])
  const [bountyApplication, setBountyApplication] = useState<BountyApplicationWithId>()
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
  async function assignHandler(bountyApplication: BountyApplicationWithId) {
    //here send an api call add a confirm dialog and just send and finish this
    setBountyApplication(bountyApplication)
    setOpen(true)

  }
  function editHandler(bountyApplication: BountyApplicationWithId) {
    alert(bountyApplication.bountyId.title)
  }

  return (
    //dont forget to add pagination here and things like that
    <BlockChainProvider>
      <div className="w-screen flex flex-col items-center justify-center mt-4">
        <div className="flex items-center justify-center m-4">
          <Input className="w-72" placeholder="enter the search query" />
          <Search color="grey" className="ml-2" />
        </div>
        <AssignDialog bountyApplication={bountyApplication} open={open} setOpen={setOpen} />
        {bountyApplications.map((bountyApplication) => (
          <Card key={bountyApplication._id} className="w-3/4" >
            <CardHeader>
              <CardTitle className="text-lg">Application ID: {bountyApplication._id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={bountyApplication.applicantId.avatar_url} />
                  <AvatarFallback>{bountyApplication.applicantId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
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
              <Button disabled={bountyApplication.bountyId.assignees.includes(userid)} onClick={() => assignHandler(bountyApplication)} variant={"outline"} >
                {
                  bountyApplication.bountyId.assignees.length > 0 ? "Assigned" : "Assign"
                }
              </Button>
              <Button onClick={() => editHandler(bountyApplication)} >
                <Edit />
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Pagination className="fixed bottom-2" >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>
    </BlockChainProvider>
  )
}

