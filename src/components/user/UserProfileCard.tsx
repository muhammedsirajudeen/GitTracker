import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { User as UserType } from '@/models/User'
import { Button } from '../ui/button'
import { toast } from '@/hooks/use-toast'
import axios from 'axios';


export default function UserProfileCard({ user }: { user: UserType | null }) {
    async function logoutHandler(){

        try {
        const response = await axios.get('/api/auth/logout', {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        console.log('Logout successful:', response.data);
        toast({ description: 'Logout successfully', className: 'bg-green-500 text-white' });
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
        } catch (error) {
        console.error('There was a problem with the logout request:', error);
        }
    }
    return (
        <Card className="w-full max-w-sm mx-auto mt-0">
            <CardHeader className="flex flex-col items-center">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.avatar_url} alt={user?.email} />
                    <AvatarFallback>
                        <User className="w-12 h-12" />
                    </AvatarFallback>
                </Avatar>
                {/* <h2 className="mt-4 text-2xl font-bold">{user.}</h2>
        <p className="text-sm text-muted-foreground">{user.role}</p> */}
            </CardHeader>
            <CardContent className="text-center">
                {/* <p className="text-sm mb-4">{user?.bio}</p> */}
                <div className="flex justify-center items-center space-x-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{user?.email}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                {/* here add logout handler */}
                <Button onClick={() => logoutHandler()} >
                    <LogOut />
                    <p className='text-xs' >logout</p>
                </Button>
                {/* <Button
          variant={isFollowing ? "outline" : "default"}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button> */}
            </CardFooter>
        </Card>
    )
}

