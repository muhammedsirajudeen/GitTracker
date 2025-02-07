'use client'
import useSWR from "swr"
import { fetcher } from "./RepositoryListing"

export default function AdminBountiesComponent(){
    const {data,isLoading}=useSWR('/api/admin/bounties',fetcher)
    console.log(data)
    return(
        <p>admin bounties</p>
    )
}