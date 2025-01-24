'use client'
import React, { useEffect, useState } from 'react';
import BountyForm from '../form/BountyForm';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Bounty } from '@/models/Bounty';
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { ChevronRight, DollarSign, FileQuestion, Users, XCircleIcon } from 'lucide-react';
import DeleteBounty from '../delete/DeleteBounty';
import { UserWithId } from '@/app/api/auth/github/route';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import BountySearch from '../search/BountySearch';
import { createPortal } from 'react-dom';
import {useWallet} from "@solana/wallet-adapter-react";

export interface BountyWithId extends Bounty {
  _id: string
}
export interface BountyWithUser extends Omit<BountyWithId, "assignees"> {
  assignees: UserWithId[]
}
interface BountyResponse {
  bounties: BountyWithUser[]
  status: number
}


const Bounties: React.FC = () => {
  const { id } = useParams()
  const { data, isLoading }: { data?: BountyResponse, isLoading: boolean } = useSWR(`/api/bounty/${id}`, fetcher)
  const [bounties, setBounties] = useState<BountyWithUser[]>([])
  const [bounty, setBounty] = useState<BountyWithUser>()
  const [server, setServer] = useState<boolean>(false)
  const {wallet,connected}=useWallet()
  console.log(connected)
  console.log(data)
  useEffect(() => {
    if (data) {
      setBounties(data.bounties)
    }
    setServer(false)
  }, [data])
  /*
    Todo:
    Get all bounties from the BountyApplication collection and if the bounty id and it matches the stuff here 
    then show the applied instead of apply and also disable the apply button
  */
  const [open, setOpen] = useState(false)
  const [bountydialog, setBountyDialog] = useState(false)
  const router = useRouter()
  const [expandedBounty, setExpandedBounty] = useState<string | null>(null)
  //convert all window.location.href to router
  function applicantPageHandler(id: string) {
    router.push(`/bounties/applications/${id}`)
  }
  return (
    <div className='w-full flex flex-col items-center justify-center  '>
      {
              typeof window !== 'undefined' && document.getElementById('searchbar-portal') && !server &&
              createPortal(<BountySearch/>, document.getElementById('searchbar-portal') as Element)
          }
      <Button onClick={() => {
        setOpen(true)
      }} >Add Bounty
      </Button>
      <BountyForm setBounties={setBounties} open={open} setOpen={setOpen} />
      {

        <div className="flex flex-col items-center justify-center mt-10 w-full px-4">

          {
            isLoading ?
              new Array(10).fill(0).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 mt-10 w-full max-w-4xl">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              ))
              :
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {
                  bounties.map((bounty) => (
                    <motion.div
                      key={bounty._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden w-96">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold truncate">{bounty.title}</CardTitle>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="flex items-center space-x-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>{bounty.bountyAmount}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Bounty Amount</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <CardDescription className="text-sm text-muted-foreground">
                            Issue ID: {bounty.issueId}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-sm ${expandedBounty === bounty._id ? '' : 'line-clamp-3'}`}>
                            {bounty.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between pt-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" onClick={() => applicantPageHandler(bounty._id)} />
                            <div className="flex -space-x-2">
                              {/* {bounty.assignees.slice(0, 3).map((assignee, index) => (
                                              <Avatar key={index} className="w-6 h-6 border-2 border-background">
                                                <AvatarFallback>{assignee.charAt(0).toUpperCase()}</AvatarFallback>
                                              </Avatar>
                                            ))} */}
                              {bounty.assignees.length > 0 && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                  +{bounty.assignees.length}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                            onClick={() => setExpandedBounty(expandedBounty === bounty._id ? null : bounty._id)}
                          >
                            {expandedBounty === bounty._id ?
                              <div className='flex items-center justify-center' >
                                {bounty.assignees.map((assignee, index) => {
                                  return (
                                    <Card key={index} className='flex items-center justify-center' >
                                      <Avatar className="w-6 h-6 border-2 border-background">
                                        <AvatarImage src={assignee.avatar_url} />
                                        <AvatarFallback>{assignee.email.charAt(0).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <span>{assignee.email}</span>
                                    </Card>
                                  )
                                })}
                              </div>
                              : 'View Assignees'}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                          <XCircleIcon onClick={() => {
                            setBountyDialog(true)
                            setBounty(bounty)

                          }} />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))

                }
              </div>
          }
          <DeleteBounty bounty={bounty} open={bountydialog} setOpen={setBountyDialog} setBounties={setBounties} />
          {
            !isLoading && bounties.length === 0 &&
            (
              <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <FileQuestion className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-bold mt-4">No Bounties Assigned</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    It looks like there are no bounties assigned at the moment. Check back later or create a new bounty to get started.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" className="mr-2">
                    Refresh
                  </Button>
                  <Button>Create Bounty</Button>
                </CardFooter>
              </Card>
            )
          }


        </div>
      }
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
  );
};

export default Bounties;