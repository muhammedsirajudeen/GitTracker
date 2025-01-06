
import { Repository } from "@/models/Repository"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Eye, GitFork, Star } from "lucide-react"
import useSWR from 'swr';
import { Dispatch, SetStateAction, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"



export default   function RepositoryListing({repositories,setRepositories}:{repositories:Repository[],setRepositories:Dispatch<SetStateAction<Repository[]>>}) {
    const fetcher = (url:string) => fetch(url).then((res) => res.json());
    const { data,isLoading } = useSWR('/api/repouser', fetcher);
    useEffect(()=>{
        setRepositories(data?.repositories as Repository[]?? [])
    },[data?.repositories, setRepositories])
    
    return (
        isLoading ? (
            [...Array(10)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))        )
        :
        repositories.map((repo, index) => (
            <Card key={index} className="mb-4 last:mb-0 w-72 h-auto">
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
                    </div>

                </CardContent>
            </Card>
        ))
    )
}