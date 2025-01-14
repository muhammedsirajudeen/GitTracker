'use client'
import React, { useEffect, useState } from 'react';
import BountyForm from '../form/BountyForm';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Bounty } from '@/models/Bounty';
import {motion} from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { ChevronRight, DollarSign, FileQuestion, Users, XCircleIcon } from 'lucide-react';
import DeleteBounty from '../delete/DeleteBounty';

export interface BountyWithId extends Bounty{
    _id:string
}
interface BountyResponse{
    bounties: BountyWithId[]
    status:number
}


const Bounties: React.FC = () => {
    const { id } = useParams()
    const { data, isLoading }:{data?:BountyResponse,isLoading:boolean} = useSWR(`/api/bounty/${id}`, fetcher)
    const [bounties,setBounties]=useState<BountyWithId[]>([])
    const [bounty,setBounty]=useState<BountyWithId>()
    useEffect(() => {
        if(data){
            setBounties(data.bounties)
        }
    }, [data])
    const [open, setOpen] = useState(false)
    const [bountydialog,setBountyDialog]=useState(false)
    const [expandedBounty, setExpandedBounty] = useState<string | null>(null)
    //would have to move this into a confirm box

    return (
        <div className='w-full flex flex-col items-center justify-center  '>
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
                                          <Users className="w-4 h-4 text-muted-foreground" />
                                          <div className="flex -space-x-2">
                                            {/* {bounty.assignees.slice(0, 3).map((assignee, index) => (
                                              <Avatar key={index} className="w-6 h-6 border-2 border-background">
                                                <AvatarFallback>{assignee.charAt(0).toUpperCase()}</AvatarFallback>
                                              </Avatar>
                                            ))} */}
                                            {bounty.assignees.length > 3 && (
                                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                                +{bounty.assignees.length - 3}
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
                                          {expandedBounty === bounty._id ? 'Collapse' : 'View Assignees'}
                                          <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                        <XCircleIcon onClick={()=>{
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
                    <DeleteBounty bounty={bounty} open={bountydialog} setOpen={setBountyDialog} setBounties={setBounties}/>
                    {
                        !isLoading && bounties.length===0 &&
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
        </div>
    );
};

export default Bounties;