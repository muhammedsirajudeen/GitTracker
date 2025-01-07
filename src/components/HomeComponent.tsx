'use client'
import RepositoryDialog from "@/components/repositoryDialog"
import RepositoryListing, { ExtendedRepo } from "@/components/RepositoryListing"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import axios from "axios"

export default function Home() {
  const [repositories, setRepositories] = useState<ExtendedRepo[]>([])
  const [page, setPage] = useState(0)
  async function paginationPrevHandler(){
    setPage(prev=>{
      const nextpage=prev-1<0?0:prev-1
      RepoBasedOnPage(nextpage)
      return nextpage
    })
  }
  function paginationNextHandler(){
    setPage(prev=>{
      const nextpage=prev+1
      RepoBasedOnPage(nextpage)
      return nextpage
    })
  }
  async function RepoBasedOnPage(page:number){
    const response=await axios.get(`/api/repouser?page=${page}`,{withCredentials:true})
    console.log(response)
    setRepositories(response.data.repositories)
  }
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
          <RepositoryDialog setRepositories={setRepositories} />
        </div>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-10 mt-10">
        <RepositoryListing repositories={repositories} setRepositories={setRepositories} />
      </div>
      <div className="fixed flex items-center justify-center w-screen bottom-0">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={paginationPrevHandler} href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{page}</PaginationLink>
              <PaginationLink href="#">{page + 1}</PaginationLink>
              <PaginationLink href="#">{page + 2}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={paginationNextHandler} href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>

    </div>
  )
}
