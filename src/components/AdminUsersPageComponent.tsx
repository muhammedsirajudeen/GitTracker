"use client"

import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { useEffect, useState } from "react"
import type { UserWith_Id } from "./ApplicationsPageComponent"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar } from "./ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
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

export default function AdminUsersPageComponent() {
  const [currentPage, setCurrentPage] = useState(0)
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/users?page=${currentPage}`, fetcher)
  const [users, setUsers] = useState<UserWith_Id[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data.users)
    }
  }, [data])

  const handleBlockToggle = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      })

      if (response.ok) {
        mutate() // Refetch the data to update the UI
      } else {
        console.error("Failed to toggle block status")
      }
    } catch (error) {
      console.error("Error toggling block status:", error)
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
        <AlertDescription>Failed to load user data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="w-full flex items-center justify-center">
          <Input className="w-96 mr-2" placeholder="Enter the search term" />
          <Search color="grey" />
        </div>

        {isLoading ? (
          <div className="space-y-4 mt-10">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <Table className="mt-10">
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Wallet Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.verified ? "Yes" : "No"}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>{user.wallet_status ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Button
                      variant={user.isBlock ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => handleBlockToggle(user._id)}
                    >
                      {user.isBlock ? "Unblock" : "Block"}
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
