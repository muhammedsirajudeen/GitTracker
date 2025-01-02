'use client'

import RepositoryDialog from "@/components/repositoryDialog"
import { Input } from "@/components/ui/input"
// import { Repository } from "@/models/Repository"
// import axios from "axios"
import { Search } from 'lucide-react'
// import { useEffect, useState } from "react"

// async function GetRepo(){
//   console.log('hey')
// }

export default function Home() {
  // const [repositories,setRepositories]=useState<Repository[]>([])
  // useEffect(()=>{
  //   async function GetRepositories(){
  //     const response=(await axios.get('/api/repository',{withCredentials:true}))
  //   }
  // },[])
  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search for repository" 
              className="pl-10 pr-4 py-2 w-full sm:w-96 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <RepositoryDialog/>

        </div>
      </div>
    </div>
  )
}

