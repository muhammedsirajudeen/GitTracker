'use client'
import { useEffect, useState } from "react";
import { BlockChainComponent } from "./wallet/BlockChainComponent";

export default function AccountPage(){
    const [server,setServer]=useState(true)
    useEffect(()=>{
        setServer(false)
    },[])
    return(
        <>
        {
            !server && (
                <BlockChainComponent/>
            )
        }
        </>
    )
}