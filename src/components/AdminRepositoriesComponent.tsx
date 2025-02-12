"use client"

import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { useEffect, useRef, useState } from "react"
import type { Repository } from "@/models/Repository"
import type { UserWith_Id } from "./ApplicationsPageComponent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Star, GitFork, Eye, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "./ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PopulatedRepository extends Omit<Repository, "owner_id"> {
  _id: string
  owner_id: UserWith_Id
}

export default function AdminRepositoriesComponent() {
  const [currentPage, setCurrentPage] = useState(0)
  const [search,setSearch]=useState("")
  const searchRef=useRef<HTMLInputElement>(null)
  const { data, error, isLoading } = useSWR(`/api/admin/repositories?page=${currentPage}&search=${search}`, fetcher)
  const [repositories, setRepositories] = useState<PopulatedRepository[]>([])

  useEffect(() => {
    if (data) {
      setRepositories(data.repositories)
    }
  }, [data])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  function searchHandler(){
    if(searchRef.current){
      setSearch(searchRef.current.value)
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load repository data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="w-full flex items-center justify-center">
          <Input ref={searchRef} className="w-96" placeholder="Enter the search term" />
          <Search onClick={searchHandler} color="grey" className="ml-2" />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-48 w-full" />
            ))}
          </div>
        ) : repositories.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500">No repositories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <Card key={repo._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={repo.owner_id.avatar_url} alt={repo.owner_id.email} />
                      <AvatarFallback>{repo.owner_id.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <CardDescription>{repo.owner_id.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4">{repo.description || "No description provided"}</p>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline">{repo.language || "Unknown"}</Badge>
                    <span className="text-sm text-gray-500">{repo.full_name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" /> {repo.forks_count}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" /> {repo.watchers_count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Pagination className="fixed bottom-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            />
          </PaginationItem>
          {[...Array(5)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(index)}
                className={currentPage === index ? "text-blue-600 font-bold" : ""}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
