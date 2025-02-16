'use client'

import { Dispatch, SetStateAction, useState } from 'react'
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
import { Star, GitFork, Eye, Search, PlusCircle, Github } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Badge } from './ui/badge'

interface ExtendedRepo extends Repository{
    _id:string
}
import {produce} from "immer"
import { Repository } from '@/models/Repository'
import { SearchRepo } from '@/serveractions/SearchRepo'
import { frontendUrl } from '@/lib/backendUrl'
export default function RepositoryDialog({setRepositories}:{setRepositories: Dispatch<SetStateAction<ExtendedRepo[]>>}) {
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()
    const [respository, setRepository] = useState<ExtendedRepo[]>([])
    const [loading, setLoading] = useState(true)
    const [error,setError]=useState(false)
    async function repoHandler() {
        // console.log('clicked')
        try {
            setError(false)
            const response = await axios.get('/api/repository', { withCredentials: true })
            console.log(response)
            if (response.status === 200) {
                const RepositoryData = response.data.repositories ?? [] as Repository[]
                setRepository(RepositoryData)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setError(true)
            setLoading(false)
            toast({ description: "Please try again", variant: "destructive", className: "bg-red-500 text-white" })
        }
    }
    async function addRepositoryHandler(repo:Repository){

        try {
            const response=await axios.post('/api/repository',{
                repository:repo
            })
            if(response.status===201){
                console.log(response.data)
                const newRepo=response.data.repository as ExtendedRepo
                toast({description:"added repository",className:"bg-green-500 text-white"})
                setRepositories(
                    produce((draft) => {
                      draft.push(newRepo ?? []);
                    })
                  );
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
    async function searchHandler(){
        setLoading(true)
        const result=await SearchRepo(searchQuery)
        console.log(result) 
        if(result){
            setRepository(result.items as ExtendedRepo[] ?? [])
        }
        setLoading(false)
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
                        <Search onClick={searchHandler} className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search repositories..."
                            value={searchQuery}
                            onChange={async (e) =>{
                                setSearchQuery(e.target.value) 
                                if(e.target.value===""){
                                    setLoading(true)
                                    const result=await SearchRepo("")
                                    if(result){
                                        setRepository(result.items)
                                    }
                                    setLoading(false)

                                }
                            }}
                            className="pl-8"
                        />
                    </div>

                    <ScrollArea className="h-72 overflow-y-scroll w-full pr-4">
                        {
                            error && (
                                <div className="flex items-center justify-center bg-background p-4">
                                <Card className="w-full max-w-md">
                                  <CardHeader className="text-center">
                                    <div className="mx-auto bg-muted rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                                      <Github className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Link Your GitHub Account</CardTitle>
                                    <CardDescription>
                                      Connect your GitHub account to enable seamless integration and access additional features.
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="flex justify-center">
                                    <Button onClick={()=>{
                                        window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=${frontendUrl}/api/auth/github&scope=repo`;

                                    }} className="bg-[#2da44e] text-white hover:bg-[#2c974b] px-6">
                                      <Github className="mr-2 h-4 w-4" />
                                      Link GitHub
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>                            )
                        }
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <ClipLoader size={40} color="hsl(var(--primary))" />
                            </div>
                        ) : respository.length === 0 ? (
                            <div className="flex items-center justify-center h-10 text-muted-foreground">
                                No repositories found
                            </div>
                        ) : (
                            respository.map((repo,index) => (
                                <Card key={index} className="mb-4 last:mb-0">
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

