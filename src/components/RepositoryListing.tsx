
import { Repository } from "@/models/Repository"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Delete, Ellipsis, Eye, GitFork, Settings, Star, Trash2, User } from "lucide-react"
import useSWR from 'swr';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface ExtendedRepo extends Repository {
    _id: string
}
export const fetcher = (url: string) => fetch(url).then((res) => res.json());




export default function RepositoryListing({ repositories, setRepositories }: { repositories: ExtendedRepo[], setRepositories: Dispatch<SetStateAction<ExtendedRepo[]>> }) {
    const { data, isLoading } = useSWR('/api/repouser', fetcher);
    const [repository,setRepository]=useState<ExtendedRepo>()
    const [dialog,setDialog]=useState<boolean>(false)
    useEffect(() => {
        setRepositories(data?.repositories as ExtendedRepo[] ?? [])
    }, [data?.repositories, setRepositories])

    async function DeleteHandler() {
        try {
            const response = (await axios.delete(`/api/repository/${repository?._id}`, { withCredentials: true }))
            if (response.status === 200) {
                toast({ description: "Repo unlisted successfully", className: "bg-green-500 text-white" })
                setRepositories((prev)=>prev.filter(p=>p._id!==repository?._id))
                setDialog(false)
            }

        } catch (error) {
            console.log(error)
            toast({ description: "Please try againt", className: "bg-red-500 text-white" })
        }
    }
    function navHandler(id:string){
        window.location.href=`/home/${id}`
    }
    return (
        <>
            {isLoading ? (
                [...Array(10)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                )))
                :
                repositories.map((repo, index) => (
                    <Card onClick={()=>navHandler(repo._id)}  key={index} className="mb-4  w-80 h-auto">
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
                                        <ContextMenu>
                                            <ContextMenuTrigger>
                                                <Button variant="ghost" size="icon">
                                                    <Ellipsis />
                                                    <span className="sr-only">More options</span>
                                                </Button>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent className="w-56">
                                                <ContextMenuItem className=" ">
                                                    <Settings /> <p className="ml-4" >Settings</p>
                                                </ContextMenuItem>
                                                <ContextMenuItem className=" ">
                                                    <User /> <p className="ml-4" >Profile</p>
                                                </ContextMenuItem>
                                                <ContextMenuItem onClick={(e)=>{
                                                    e.stopPropagation()
                                                    setDialog(true)
                                                    setRepository(repo)
                                                }
                                                }  className="text-red-600 ">
                                                    <Delete /><p className="ml-4" >Delete</p>
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
                
                
            }
            {repositories.length===0&& !isLoading &&
            (
                <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">No Repositories Found</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <GitFork className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    It looks like there are no repositories associated with this account yet.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">Refresh Repositories</Button>
                </CardFooter>
              </Card>            )
        }
    <Dialog open={dialog}  >
      <DialogContent className="bg-black" >
        <DialogHeader>
          <DialogTitle>Delete Repository</DialogTitle>
          <DialogDescription className="text-white" >
            Are you absolutely sure you want to delete the repository {repository?.name}? This action cannot be undone.
            This will permanently delete the repository and remove all its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={()=>setDialog(false)} >
            Cancel
          </Button>
          <Button variant="destructive" onClick={DeleteHandler}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

        </>
    )
}