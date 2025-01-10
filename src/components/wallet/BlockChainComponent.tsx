import React, { FC } from 'react';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
 
import '@solana/wallet-adapter-react-ui/styles.css';
import WalletStatus from './WalletStatus';
import useGlobalStore from '@/store/GlobalStore';
import UserProfileCard from '../user/UserProfileCard';
import { BlockChainProvider } from './BlockChainProvider';



export const BlockChainComponent: FC = () => {
    const {user}=useGlobalStore()
    return (
     <BlockChainProvider>
        <UserProfileCard user={user}/>
        <div className='flex items-center justify-evenly' >
            <WalletMultiButton style={{backgroundColor:"black"}} />
            <WalletDisconnectButton  style={{backgroundColor:"black"}}  />
        </div>
        <WalletStatus/>
     </BlockChainProvider>  
    );
};

