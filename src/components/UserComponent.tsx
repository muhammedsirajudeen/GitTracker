'use client'
import { UserWithId } from "@/app/api/auth/github/route"
import useGlobalStore from "@/store/GlobalStore"
import axios from "axios"
import { useEffect } from "react"

export default function UserComponent(){
    const {setUser}=useGlobalStore()
    useEffect(()=>{
        async function UserFetcher(){
            try {
                const response=await axios.get('/api/auth/verify',{withCredentials:true})
                if(response.status===200){
                    console.log(response.data)
                    const user=response.data.user as UserWithId
                    setUser(user)
                }                
            } catch (error) {
                console.log(error)
            }
        }
        UserFetcher()
    },[setUser])
    return(
        <></>
    )
}