import React from 'react';
import { TokenVerification } from '../home/page';
import { redirect } from 'next/navigation';
import AccountPage from '@/components/AccountPageComponent';

const Page: React.FC = async   () => {
    const user=await TokenVerification()
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