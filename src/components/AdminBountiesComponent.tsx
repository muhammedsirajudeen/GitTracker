"use client"

import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { useEffect, useState } from "react"
import type { PopulatedBounty } from "./BountyPageComponent"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ExternalLink, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

export default function AdminBountiesComponent() {
  const [currentPage, setCurrentPage] = useState(0)
  const { data, error, isLoading } = useSWR(`/api/admin/bounties?page=${currentPage}`, fetcher)
  const [bounties, setBounties] = useState<PopulatedBounty[]>([])

  useEffect(() => {
    if (data) {
      setBounties(data.bounties)
    }
  }, [data])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load bounty data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="w-full flex items-center justify-center">
          <Input placeholder="enter the search term" className="w-96" />
          <Search color="grey" className="ml-2 h-6 w-6" />
        </div>
        {isLoading ? (
          <div className="space-y-4 mt-10">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : bounties.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500">No bounties available.</p>
          </div>
        ) : (
          <Table className="mt-10">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Repository</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bounties.map((bounty) => (
                <TableRow key={bounty._id}>
                  <TableCell className="font-medium">{bounty.title}</TableCell>
                  <TableCell>{bounty.repositoryId.name}</TableCell>
                  <TableCell>${bounty.bountyAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bounty.status!)}>{bounty.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
