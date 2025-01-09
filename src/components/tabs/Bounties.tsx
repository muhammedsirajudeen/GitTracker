'use client'
import React, { useState } from 'react';
import BountyForm from '../form/BountyForm';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';

const Bounties: React.FC = () => {
    const {id}=useParams()
    const {data,isLoading}=useSWR(`/api/bounty/${id}`, fetcher)
    console.log(data,isLoading)
    const [open,setOpen]=useState(false)
    return (
        <div className='w-full flex flex-col items-center justify-center  '>
            <Button onClick={()=>{
            setOpen(true)
            }} >Add Bounty</Button>
            <BountyForm open={open} setOpen={setOpen} />
        </div>
    );
};

export default Bounties;