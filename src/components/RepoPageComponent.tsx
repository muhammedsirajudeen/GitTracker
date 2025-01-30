"use client"
import { fetcher } from "@/components/RepositoryListing"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Eye, GitFork, Star } from "lucide-react"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bug, CheckSquare, Award, MessageSquare, FolderTree } from 'lucide-react'
import Issues from "./tabs/Issues"
import { useState } from "react"
import Bounties from "./tabs/Bounties"
import FolderStructure from "./tabs/FolderStructure"
import {BlockChainProvider} from "@/components/wallet/BlockChainProvider";
import Chat from "./tabs/Chat"
import TaskManagementComponent from "./tabs/TaskManagementTab"

export default function RepoPage() {
    const { id } = useParams()
    const { data, isLoading } = useSWR(`/api/repository/${id}`, fetcher);
    const [tab, seTab] = useState('issues')
    const repo = data?.repository
    return (
        <>
            <div className="w-full max-w-3xl mx-auto px-4 py-4">
                <Tabs defaultValue="issues" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-black border border-gray-800">
                        <TabsTrigger
                            onClick={() => seTab('issues')}
                            value="issues"
                            className="flex items-center justify-center py-2 px-4 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-sm transition-colors duration-200"
                        >
                            <Bug className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Issues</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="tasks"
                            onClick={() => seTab('tasks')}
                            className="flex items-center justify-center py-2 px-4 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-sm transition-colors duration-200"
                        >
                            <CheckSquare className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Task Management</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="bounty"
                            onClick={() => seTab('bounty')}
                            className="flex items-center justify-center py-2 px-4 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-sm transition-colors duration-200"
                        >
                            <Award className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Bounty</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="talk"
                            onClick={() => seTab('talk')}
                            className="flex items-center justify-center py-2 px-4 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-sm transition-colors duration-200"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Talk to Repo</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="structure"
                            onClick={() => seTab('structure')}
                            className="flex items-center justify-center py-2 px-4 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800 rounded-sm transition-colors duration-200"
                        >
                            <FolderTree className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Folder Structure</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div id="searchbar-portal" className="flex w-full items-center justify-center">

            </div>
            {
                isLoading ?
                    <div className="w-full flex items-center justify-center mt-10">

                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex w-full items-center justify-center mt-10" >
                        <Card className="mb-4  w-80 h-auto">
                            <CardHeader>
                                <CardTitle className="text-lg">{repo?.name}</CardTitle>
                                <CardDescription>{repo?.description || 'No description provided'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Badge variant={"outline"}>{repo?.language || 'Unknown'}</Badge>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4" />
                                            <span>{repo?.stargazers_count}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <GitFork className="w-4 h-4" />
                                            <span>{repo?.forks_count}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{repo?.watchers_count}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
            }
            {
                tab === 'issues' && <Issues />
            }
            {
                tab === 'tasks' && <TaskManagementComponent/>
            }
            {
                tab === 'bounty' && <BlockChainProvider><Bounties/></BlockChainProvider>
            }
            {
                tab === 'talk' && <BlockChainProvider><Chat/></BlockChainProvider>
            }
            {
                tab === 'structure' && <FolderStructure/>
            }
        </>

    )
}