"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import axios from "axios"
import { useParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { GitHubIssue } from "@/lib/types"

export const searchFormSchema = z.object({
    query: z.string().min(0),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

//convert this to a generic search component that can be used everywhere
export default function IssueSearch({setIssues}:{setIssues:Dispatch<SetStateAction<GitHubIssue[]>>}) {
    const [isSearching, setIsSearching] = useState(false)
    const render=useRef(0)
    const {id}=useParams()
    const form = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            query: "",
        },
    })
    const query=form.watch('query')

    async function onSubmit(data: SearchFormValues) {
        if(query==='') {
            toast({description:"Please enter a search query",className:"bg-orange-500 text-white"})
            return
        }
        setIsSearching(true)

        try {
            const response = await axios.get(`/api/issues/${id}?search=${data.query}`, { withCredentials: true })
            console.log("Issue search response:", response.data)
            setIssues(response.data.issues)
        } catch (error) {
            console.log(error)
            toast({description:"Error while searching",className:"bg-red-500 text-white"})
        }
        setIsSearching(false)            

    }
    useEffect(()=>{
        async function asyncWrapper(){
            setIsSearching(true)
            const response = await axios.get(`/api/issues/${id}`, { withCredentials: true })
            console.log("Issue search response:", response.data)
            setIssues(response.data.issues)
            setIsSearching(false)
        }
        if(query==='' && render.current>0){
            asyncWrapper()
        }   
        render.current++
    },[id, query, setIssues])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-2">
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-[300px]  text-white placeholder-gray-400 focus:ring-gray-500"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="absolute mt-1 text-xs text-red-500" />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" disabled={isSearching}>
                    {isSearching ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                    <span className="sr-only">Search</span>
                </Button>
            </form>
        </Form>
    )
}

