'use client'
import React from 'react';
import BountyForm from '../form/BountyForm';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useParams } from 'next/navigation';

const Bounties: React.FC = () => {
    const {id}=useParams()
    const {data,isLoading}=useSWR(`/api/bounty/${id}`, fetcher)
    console.log(data)
    return (
        <div className='w-full flex flex-col items-center justify-center mt-10'>
            <BountyForm/>
        </div>
    );
};

export default Bounties;