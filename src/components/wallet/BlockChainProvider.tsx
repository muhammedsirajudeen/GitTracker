import React, { FC, useMemo, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import useGlobalStore from '@/store/GlobalStore';
import { SOLANA_API } from '@/lib/types';

export const BlockChainProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet; 
    const endpoint = useMemo(() => /*clusterApiUrl(network)*/ SOLANA_API , []);
    const { setEndpoint } = useGlobalStore();

    useEffect(() => {
        setEndpoint(endpoint);
    }, [endpoint, setEndpoint]);

    const wallets = useMemo(
        () => [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};