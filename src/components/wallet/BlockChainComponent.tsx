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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Achievements from '../tabs/Achievements';
import TransactionsComponent from '../custom/TransactionsComponent';


export const BlockChainComponent: FC = () => {
    const { user } = useGlobalStore()
    return (
        <BlockChainProvider>
            <Tabs defaultValue="wallet" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="wallet">
                    <Card>
                        <CardHeader>
                            <CardTitle>Wallet</CardTitle>
                            <CardDescription>Manage your blockchain wallet and view your profile.</CardDescription>
                        </CardHeader>
                        <CardContent className='flex w-full items-center justify-center flex-col' >
                            <UserProfileCard user={user}/>
                            <div className='flex items-center justify-evenly mt-4' >
                                <WalletMultiButton style={{backgroundColor:"black"}} />
                                <WalletDisconnectButton style={{backgroundColor:"black"}} />
                            </div>
                            <WalletStatus/>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="achievements">
                    <Achievements/>
                </TabsContent>
                
                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stats</CardTitle>
                            <CardDescription>Your blockchain statistics and analytics.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Placeholder for blockchain stats.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="history">
                    <TransactionsComponent/>
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                            <CardDescription>Your transaction history and past activities.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Placeholder for transaction history.</p>
                        </CardContent>
                    </Card> */}
                </TabsContent>
            </Tabs>
        </BlockChainProvider>  
    );
};


