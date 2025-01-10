'use client'
import React, { useState } from 'react';
import BountyForm from '../form/BountyForm';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const Bounties: React.FC = () => {
    const { id } = useParams()
    const { data, isLoading } = useSWR(`/api/bounty/${id}`, fetcher)
    console.log(data, isLoading)
    const [open, setOpen] = useState(false)
    return (
        <div className='w-full flex flex-col items-center justify-center  '>
            <Button onClick={() => {
                setOpen(true)
            }} >Add Bounty</Button>
            <BountyForm open={open} setOpen={setOpen} />
            {

                <div className="flex flex-col items-center justify-center mt-10 w-full px-4">
                    {
                        new Array(10).fill(0).map((_, index) => (
                            <div key={index} className="flex items-center space-x-4 mt-10 w-full max-w-4xl">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
};

export default Bounties;