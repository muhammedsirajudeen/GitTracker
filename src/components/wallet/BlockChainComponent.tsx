import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
 
import '@solana/wallet-adapter-react-ui/styles.css';
import WalletStatus from './WalletStatus';
import useGlobalStore from '@/store/GlobalStore';
import UserProfileCard from '../user/UserProfileCard';
 
export const BlockChainComponent: FC = () => {
    const {user}=useGlobalStore()
    const network = WalletAdapterNetwork.Devnet; 
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider >
                    <UserProfileCard user={user}/>
                    <div className='flex items-center justify-evenly' >
                        <WalletMultiButton style={{backgroundColor:"black"}} />
                        <WalletDisconnectButton  style={{backgroundColor:"black"}}  />
                    </div>
                    <WalletStatus endpoint={endpoint}/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

