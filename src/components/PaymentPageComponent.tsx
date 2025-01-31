"use client"

import { Fragment, useEffect, useState } from "react"
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
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { SOLANA_API } from "@/lib/types"
import { useWallet } from "@solana/wallet-adapter-react"
import axios, { AxiosError } from "axios"
import { HttpStatus } from "@/lib/HttpStatus"
import { BountyWithId } from "./tabs/Bounties"
import { produce } from "immer"
  
interface BountyRedemptionResponse {
    bountyredemptions: PopulatedBountyRedemption[]
    status: number
}

export default function PaymentPageComponent() {
    const {publicKey,signTransaction,sendTransaction}=useWallet()
    const { data, isLoading, }: { data?: BountyRedemptionResponse; isLoading: boolean; } = useSWR(
        "/api/admin/payments",
        fetcher,
    )
    const [bountyredemptions,setBountyredemptions]=useState<PopulatedBountyRedemption[]>([])
    useEffect(()=>{
        if(data){
            setBountyredemptions(data.bountyredemptions)
        }
    },[data])
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    //loading indicator
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
    async function releaseHandler(redemption:PopulatedBountyRedemption){
        try {
            const connection=new Connection(SOLANA_API)
            const recieverAddress=redemption.applicantId.wallet_address
            if(!recieverAddress){
                toast({description:"Unlinked wallet detected",className:"bg-orange-500 text-white"})
                return
            }
            const amount=redemption.bountyId.bountyAmount
            const {blockhash}=await connection.getLatestBlockhash()
            if(!publicKey){
                toast({description:"Public key is not defined",className:"bg-orange-500 text-white"})
                return
            }
            const transaction=new Transaction().add(
                SystemProgram.transfer(
                    {
                        fromPubkey:publicKey,
                        toPubkey:new PublicKey(recieverAddress ?? ""),
                        lamports:amount
                    }
                )
            )  
            transaction.recentBlockhash=blockhash
            transaction.feePayer=publicKey
            if(!signTransaction){
                toast({description:"please try again",className:"bg-red-500"})
                return
            }
            const signedTransaction=await signTransaction(transaction)
            const txId=await sendTransaction(signedTransaction,connection)
            toast({description:"Transaction completed successfully",className:"bg-green-500 text-white"})
            //save it to a database using server actions as side effects
            console.log(txId)
            //change the status of bounty redemption to true
            try {
                const  bounty=(redemption.bountyId) as BountyWithId
                const response=await axios.put(`/api/bountyredemption/${bounty._id}`,{},{withCredentials:true})
                if(response.status===HttpStatus.OK){
                    toast({description:"bounty redemption and bounty successfully marked complete",className:"bg-green-500 text-white"})
                    setBountyredemptions(produce((draft)=>{
                        draft.forEach((d)=>{
                            if(d._id===redemption._id){
                                d.status="completed"
                            }
                        })
                    }))
                }
            } catch (error) {
                const axiosError=error as AxiosError
                if(axiosError.status===HttpStatus.CONFLICT){
                    toast({description:"Invalid arguments",className:"bg-red-500 text-white"})
                }else{
                    toast({description:"Try entering the details manually",className:"bg-red-500 text-white"})
                }
            }

        } catch (error) {
            const clientError=error as Error
            console.log(clientError.message)
            toast({description:"please try again",className:"bg-red-500 text-white"})
        }
        //ensure that its not forged call a server action to fetch the latest data from the database
    }
    return (
        <>
            <div className="flex items-center justify-center" >
                <Input className="w-96" placeholder="enter the search query.." />
                <Search color="grey" className="ml-2" />
            </div>
            <div className="w-full flex items-center justify-center">
                <Card className="w-3/4 mt-4">
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
                                {bountyredemptions.map((redemption) => (
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
                                                {
                                                    redemption.status!=="completed" ?

                                                    <Button  variant="outline" onClick={() => releaseHandler(redemption)}>
                                                        Release
                                                    </Button>
                                                    :
                                                    <Button variant="outline" disabled={true}  >Released</Button>

                                                }
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
            </div>
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