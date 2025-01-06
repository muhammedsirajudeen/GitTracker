
import { Repository } from "@/models/Repository"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Eye, GitFork, Star } from "lucide-react"
import useSWR from 'swr';
import { Dispatch, SetStateAction, useEffect } from "react";



export default   function RepositoryListing({repositories,setRepositories}:{repositories:Repository[],setRepositories:Dispatch<SetStateAction<Repository[]>>}) {
    const fetcher = (url:string) => fetch(url).then((res) => res.json());
    const { data } = useSWR('/api/repouser', fetcher);
    useEffect(()=>{
        setRepositories(data?.repositories as Repository[]?? [])
    },[data?.repositories, setRepositories])
    
    return (
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