import React, { FC } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, Star, Trophy, Zap } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Achievements() {
    const {wallet,publicKey}=useWallet()
    const {data,isLoading}=useSWR(`/api/account/nft/${publicKey}`,fetcher)
    console.log(data)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>View your blockchain achievements and milestones.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <AchievementCard 
                        title="First Transaction" 
                        description="Completed your first blockchain transaction" 
                        icon={<Zap className="h-6 w-6" />}
                    />
                    <AchievementCard 
                        title="Hodler" 
                        description="Held tokens for over 1 year" 
                        icon={<Trophy className="h-6 w-6" />}
                    />
                    <AchievementCard 
                        title="Power User" 
                        description="Executed 100+ smart contract interactions" 
                        icon={<Star className="h-6 w-6" />}
                    />
                    <AchievementCard 
                        title="Early Adopter" 
                        description="Joined during the platform's beta phase" 
                        icon={<Activity className="h-6 w-6" />}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

interface AchievementCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const AchievementCard: FC<AchievementCardProps> = ({ title, description, icon }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
                <Badge className="mt-2">Unlocked</Badge>
            </CardContent>
        </Card>
    );
};
