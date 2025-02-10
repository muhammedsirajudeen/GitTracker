"use client"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import type { PopulatedTransaction } from "@/models/Transaction"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar } from "./ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "./ui/skeleton"

export default function AdminTransactionsComponent() {
    const [currentPage, setCurrentPage] = useState(0)
    const { data, isLoading } = useSWR(`/api/admin/transactions?page=${currentPage}`, fetcher)
    const [transactions, setTransactions] = useState<PopulatedTransaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<PopulatedTransaction[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    console.log(data)
    useEffect(() => {
        if (data) {
            setTransactions(data.transactions)
            setFilteredTransactions(data.transactions)
        }
    }, [data])

    useEffect(() => {
        const filtered = transactions.filter(
            (transaction) =>
                transaction.fromAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.toAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.id.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredTransactions(filtered)
    }, [searchTerm, transactions])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
    return (
        <>
            <div className="container mx-auto py-10">
                <div className="flex items-center w-full justify-center space-x-2 mb-6">
                    <Input
                        placeholder="Search by ID, From Address, or To Address"
                        className="w-96"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                {isLoading ? (
                    <div className="space-y-4 mt-10">
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full" />
                        ))}
                    </div>) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>From Address</TableHead>
                                <TableHead>To Address</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Receiver ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>{transaction.fromAddress}</TableCell>
                                    <TableCell>{transaction.toAddress}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                                    <TableCell className="flex items-center justify-evenly">
                                        <Avatar>
                                            <AvatarImage src={transaction.userId.avatar_url} alt={transaction.userId.email} />
                                            <AvatarFallback>{transaction.userId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <p>{transaction.userId.email}</p>
                                    </TableCell>
                                    {/* <TableCell>{transaction.recieverId || "N/A"}</TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {filteredTransactions.length === 0 && !isLoading && <p className="text-center mt-4">No transactions found.</p>}

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

