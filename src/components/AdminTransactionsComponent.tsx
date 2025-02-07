'use client'

import useSWR from "swr"
import { fetcher } from "./RepositoryListing"

export default function AdminTransactionsComponent(){
    const {data,isLoading}=useSWR('/api/admin/transactions',fetcher)
    console.log(data)
    return(
        <p>transactions</p>
    )
}