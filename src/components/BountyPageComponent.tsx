'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, DollarSign, Inbox, Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BountyWithId } from './tabs/Bounties'
import { User } from '@/models/User'
import { Repository } from '@/models/Repository'
import { Avatar, AvatarImage } from './ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { toast } from '@/hooks/use-toast'
import ApplyDialog from './dialog/ApplyDialog'
import { Input } from './ui/input'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { BountyApplication } from '@/models/BountyApplication'
import AssignedDialog from './dialog/AssignedDialog'

export interface PopulatedBounty extends Omit<BountyWithId, "ownerId" | "repositoryId"> {
    ownerId: Pick<User, "avatar_url" | "email">
    repositoryId: Repository
}


interface BountyResponse {
    bounties: PopulatedBounty[];
}

export interface BountyApplicationString extends Omit<BountyApplication,"bountyId">{
    bountyId: string;
}

interface BountyApplicationResponse{
    applications:string[]
    status:number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BountyPageComponent() {
    const [open, setOpen] = useState<boolean>(false)
    const [assignedDialog,setAssignedDialog] = useState<boolean>(false)
    const { data, error, isLoading } = useSWR<BountyResponse>('/api/bounty', fetcher)
    const {data:applicationdata}=useSWR<BountyApplicationResponse>('/api/application',fetcher)
    const [applications,setApplications]=useState<string[]>([])
    useEffect(()=>{
        setApplications(applicationdata?.applications ?? [])
    },[applicationdata?.applications]) 
    const [bounty, setBounty] = useState<PopulatedBounty>()
    const [expandedBounty, setExpandedBounty] = useState<string | null>(null)
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to load bounties. Please try again later.</AlertDescription>
            </Alert>
        )
    }

    if (isLoading) {
        return (
            <div className="w-full mt-2 flex items-center flex-col justify-center">
                {[...Array(4)].map((_, index) => (
                    <Card key={index} className='w-3/4 mt-2' >
                        <CardHeader>
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!data || data.bounties.length === 0) {
        return (
            <div className='flex items-center justify-center w-full flex-col'>
                <Card className="w-full max-w-md mx-auto mt-4">
                <CardContent className="pt-6 pb-4 text-center">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No bounties available</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    There are currently no bounties to display. Why not create one and kickstart the community?
                </p>
                </CardContent>
                <CardFooter>
                <Button  className="w-full">
                    Create a New Bounty
                </Button>
                </CardFooter>
            </Card>
            </div>
        )
    }
    function applyHandler(bounty: PopulatedBounty) {
        //here handle the apply bounty part
        setBounty(bounty)
        setOpen(true)
    }
    function searchHandler() {
        toast({ description: "implement search", className: "bg-blue-500 text-white" })
    }
    function assignedHandler(){
        setAssignedDialog(true)
    }
    return (
        <div className="w-full flex items-center justify-center flex-col mt-2">
            <div className='flex items-center justify-center'>
                <Input className='mr-3 w-72' placeholder='enter the search term' />
                <Search onClick={searchHandler} size={20} color='grey' />
            </div>
            <AssignedDialog open={assignedDialog} setOpen={setAssignedDialog}/>
            <Button onClick={assignedHandler}  className='mt-4' >Assigned Bounties</Button>
            {data.bounties.map((bounty) => (
                <Card key={bounty._id} className="overflow-hidden w-3/4 mt-4">
                    <CardHeader>
                        <div className='flex items-center justify-starts'>
                            <Avatar className='h-8 w-8' >
                                <AvatarImage src={bounty.ownerId.avatar_url} />
                                <AvatarFallback>{bounty.ownerId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className='text-xs font-bold ml-2' >{bounty.ownerId.email}</p>
                            <Badge className='ml-10' >
                                <p className='text-xs font-semibold' >{bounty.repositoryId.name}</p>
                            </Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold truncate">{bounty.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-2">
                            <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                            <span className="font-bold text-green-500">{bounty.bountyAmount.toFixed(2)}</span>
                        </div>
                        <p className={`text-sm text-gray-500 ${expandedBounty === bounty._id ? '' : 'line-clamp-2'}`}>
                            {bounty.description}
                        </p>
                        {bounty.description.length > 100 && (
                            <button
                                className="text-sm text-blue-500 mt-1 hover:underline focus:outline-none"
                                onClick={() => setExpandedBounty(expandedBounty === bounty._id ? null : bounty._id)}
                            >
                                {expandedBounty === bounty._id ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button disabled={applications.includes(bounty._id)} variant={"outline"} onClick={() => applyHandler(bounty)}>
                       {applications.includes(bounty._id) ? "Applied":"Apply" }
                        
                            </Button>
                    </CardFooter>

                </Card>
            ))}
            <ApplyDialog setApplications={setApplications} bounty={bounty} open={open} setOpen={setOpen} />
            {/* dialog for accepting bounties */}
            <Pagination className='fixed bottom-2' >
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
    )
}

