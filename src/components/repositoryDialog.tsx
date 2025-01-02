'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'
import ClipLoader from 'react-spinners/ClipLoader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Star, GitFork, Eye, Search, PlusCircle } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Badge } from './ui/badge'

//id name fullname avatarurl htmlurl
interface Repository {
    id: number
    name: string
    fullname: string
    description: string
    language: string
    stargazers_count: number
    forks_count: number
    watchers_count: number

}
export default function RepositoryDialog() {
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()
    const [respository, setRepository] = useState<Repository[]>([])
    const [loading, setLoading] = useState(true)
    async function repoHandler() {
        // console.log('clicked')
        try {
            const response = await axios.get('/api/repository', { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                const RepositoryData = response.data.repositories ?? [] as Repository[]
                setRepository(RepositoryData)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            toast({ description: "Please try again", variant: "destructive", className: "bg-red-500 text-white" })
        }
    }
    async function addRepositoryHandler(repo:Repository){
        console.log(repo)
        try {
            const response=await axios.post('/api/repository',{
                repository:repo
            })
            if(response.status===201){
                toast({description:"added repository",className:"bg-green-500 text-white"})
            }
        } catch (error) {
            console.log(error)
            const axiosError=error as AxiosError
            if(axiosError.status===409){
                toast({description:"repo has already been saved",className:"bg-orange-500 text-white"})
            }else{
                toast({description:"please try again",className:"bg-red-500 text-white"})
            }
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={repoHandler} >Add Repository</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] sm:h-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Repositories</DialogTitle>
                    <DialogDescription>
                        Search and select the repositories you want to add, then click confirm.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 h-full">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search repositories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <ScrollArea className="h-72 overflow-y-scroll w-full pr-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <ClipLoader size={40} color="hsl(var(--primary))" />
                            </div>
                        ) : respository.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No repositories found
                            </div>
                        ) : (
                            respository.map((repo) => (
                                <Card key={repo.id} className="mb-4 last:mb-0">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                                        <CardDescription>{repo.description || 'No description provided'}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <Badge variant={"outline"}>{repo.language || 'Unknown'}</Badge>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4" />
                                                    <span>{repo.stargazers_count}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <GitFork className="w-4 h-4" />
                                                    <span>{repo.forks_count}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{repo.watchers_count}</span>
                                                </div>
                                            </div>
                                            <PlusCircle onClick={()=>addRepositoryHandler(repo)} />
                                        </div>

                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button type="submit">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

