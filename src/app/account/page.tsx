import React from 'react';
import { redirect } from 'next/navigation';
import AccountPage from '@/components/AccountPageComponent';
import { GetUserGivenAccessToken } from '@/lib/tokenHelper';
import { cookies } from 'next/headers';

const Page: React.FC = async   () => {
    const user=await GetUserGivenAccessToken(cookies())
    if(!user){
        redirect('/login')
    }
    return (
        <div className='flex flex-col w-full items-center justify-center'>
            <AccountPage/>
        </div>
    );
};

export default Page;