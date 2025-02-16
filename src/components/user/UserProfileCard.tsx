import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { User as UserType } from '@/models/User'
import { Button } from '../ui/button'
import { toast } from '@/hooks/use-toast'
import axios from 'axios';
import { useRef, useState } from 'react'
import { UpdateUserProfile } from '@/serveractions/UpdateUserProfile'
import { ClipLoader } from 'react-spinners'
import { isImageFile } from '@/lib/isFile'
import { useRouter } from 'next/navigation'
import useGlobalStore from '@/store/GlobalStore'
import { backendUrl, frontendUrl } from '@/lib/backendUrl'


export default function UserProfileCard({ user }: { user: UserType | null }) {
    const fileRef=useRef<HTMLInputElement>(null)
    const imageRef=useRef<HTMLImageElement>(null)
    const [uploading,setUploading]=useState(false)
    const [newImage,setNewImage]=useState(false)
    const router=useRouter()
    const {setUser}=useGlobalStore()
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
    function fileuploadHandler(){
        try {
            if(fileRef.current){
                fileRef.current.click()
            }
            // toast({description:'implementation pending',className:'bg-orange-500 text-white'})
        } catch (error) {
            console.log(error)
            toast({description:"Error in uploading file",className:'bg-red-500 text-white'})
        }
    }
    async function fileChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setUploading(true)
        try {
            console.log(e.target.files)
            const file=e.target.files
            if(!file){
                toast({description:'please enter a file',className:'bg-orange-500 text-white'})
                setUploading(false)

                return
            }
            const fileStatus=await isImageFile(file[0])
            if(!fileStatus){
                toast({description:'please enter a image file',className:'bg-red-500 text-white'})
                setUploading(false)
                return
            }
            // if(file){
            //     const fileStatus=await isImageFile(file[0])
            //     if(!fileStatus){
            //         to
            //     }
            // }

            if(!file){
                toast({description:'please enter a file',className:'bg-orange-500 text-white'})
                setUploading(false)
                return
            }
            const url=URL.createObjectURL(file[0])
            if(imageRef.current){
                imageRef.current.src=url
                setNewImage(true)
            }
            //make network request but before that create the api end point
            console.log(imageRef.current)
            const formData=new FormData()
            formData.append('profileImage',file[0])
            const response=await axios.post(`${backendUrl}/upload`,formData,{timeout:10000})
            console.log(response)
            const status=await UpdateUserProfile(response.data.url)

            console.log(status)
            if(status){
                toast({description:'Succeeded in uploading profile image',className:'bg-green-500 text-white'})
                //instead of this use state update      
                router.replace('/account')   
                setUser({...user!,avatar_url:response.data.url})       
                // window.location.reload()
                

            }
        } catch(error) {
            console.log(error)
            toast({description:"Error in uploading file",className:'bg-red-500 text-white'})
        }
        setUploading(false)
    }
    return (
        <Card className="w-full max-w-sm mx-auto mt-0">
            <input ref={fileRef} type='file' className='hidden' onChange={fileChangeHandler} />
            <CardHeader className="flex flex-col items-center">
                <Avatar className="w-24 h-24">
                    <AvatarImage ref={imageRef} onClick={fileuploadHandler}  src={user?.avatar_url} alt={user?.email} />
                    {
                        !newImage &&
                    <AvatarFallback  onClick={fileuploadHandler}>
                        <User className="w-12 h-12" />
                    </AvatarFallback>
                    }
                </Avatar>
                {
                    uploading && <ClipLoader size={20} color='white' />
                }
            </CardHeader>
            <CardContent className="text-center">
                <div className="flex justify-center items-center space-x-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{user?.email}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => logoutHandler()} >
                    <LogOut />
                    <p className='text-xs' >logout</p>
                </Button>

            </CardFooter>
        </Card>
    )
}

