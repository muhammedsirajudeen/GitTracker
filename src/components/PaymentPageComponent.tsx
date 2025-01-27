"use client"

import { Fragment, useState } from "react"
import useSWR from "swr"
import { fetcher } from "../components/RepositoryListing"
import type { PopulatedBountyRedemption } from "@/models/BountyRedemption"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronDown, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { toast } from "@/hooks/use-toast"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { Input } from "./ui/input"
  
interface BountyRedemptionResponse {
    bountyredemptions: PopulatedBountyRedemption[]
    status: number
}

export default function PaymentPageComponent() {
    const { data, isLoading, }: { data?: BountyRedemptionResponse; isLoading: boolean; } = useSWR(
        "/api/admin/payments",
        fetcher,
    )
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const toggleRowExpansion = (id: string) => {
        const newExpandedRows = new Set(expandedRows)
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id)
        } else {
            newExpandedRows.add(id)
        }
        setExpandedRows(newExpandedRows)
    }

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    if (!data || !data.bountyredemptions) return <div>No data available</div>
    function releaseHandler(redemption:PopulatedBountyRedemption){
        toast({description:'Implementation pending',className:"bg-orange-500 text-white"})
    }
    return (
        <>
            <div className="flex items-center justify-center" >
                <Input className="w-96" placeholder="enter the search query.." />
                <Search color="grey" className="ml-2" />
            </div>
            <Card className="w-full mt-4">
                <CardHeader>
                    <CardTitle>Bounty Redemptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Repository</TableHead>
                                <TableHead>Bounty Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.bountyredemptions.map((redemption) => (
                                <Fragment key={redemption._id}>
                                    <TableRow>
                                        <TableCell className="flex items-center" >
                                            <Avatar>
                                                <AvatarImage src={redemption.applicantId.avatar_url} />
                                                <AvatarFallback>{redemption.applicantId.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {redemption.applicantId.email}
                                        </TableCell>
                                        <TableCell>{redemption.fullName}</TableCell>
                                        <TableCell>${redemption.bountyId.bountyAmount}</TableCell>
                                        <TableCell>
                                            <Badge variant={redemption.bountyId.status === "pending" ? "default" : "outline"}>
                                                {redemption.bountyId.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => toggleRowExpansion(redemption._id)}>
                                                Details <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" onClick={() => releaseHandler(redemption)}  >Release</Button>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRows.has(redemption._id) && (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <div className="p-4 bg-muted rounded-md">
                                                    <h4 className="font-semibold mb-2">Additional Details</h4>
                                                    <p>
                                                        <strong>Wallet Address:</strong> {redemption.applicantId.wallet_address}
                                                    </p>
                                                    <p>
                                                        <strong>Bounty Title:</strong> {redemption.bountyId.title}
                                                    </p>
                                                    <p>
                                                        <strong>Bounty Description:</strong> {redemption.bountyId.description}
                                                    </p>
                                                    <p>
                                                        <strong>Pull Request Number:</strong> {redemption.pullrequestNumber}
                                                    </p>
                                                    <p>
                                                        <strong>Created At:</strong> {redemption.createdAt && new Date(redemption.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    )}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination>
            <PaginationContent className="fixed bottom-0" >
                <PaginationItem>
                <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
            </Pagination>

        </>
    )
}