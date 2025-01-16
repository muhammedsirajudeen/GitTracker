'use client'

import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import { Button } from "../ui/button"

export default function FolderStructure(){
    const {id}=useParams()
    const {data,isLoading}=useSWR(`/api/folderstructure/${id}`,fetcher)
    // useEffect(()=>{
    //     async function structureFetcher(){
    //         try {
    //             const response=await axios.post(`/api/folderstructure`,
    //                 {
    //                     githubRepo:id,
    //                 },
    //                 {
    //                     withCredentials:true,
    //                 }
    //             )
    //         } catch (error) {
    //             console.log(error)
    //             toast({description: "please try again",className:"bg-red-500 text-white"})
    //         }
    //     }
    // },[])
    function textSummary(){
        toast({description: "Text Summary generated successfully", className: "bg-green-500 text-white" })
        // window.location.href=`/textsummary/${id}`
    }
    return(
        <div className="flex w-full items-center justify-center">
        <Button onClick={()=>textSummary()} >Text Summary</Button>
        </div>
    )
}