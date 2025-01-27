'use client'
import PaymentPageComponent from "@/components/PaymentPageComponent";
import { BlockChainProvider } from "@/components/wallet/BlockChainProvider";

export default function PaymentsPage(){
    return(
        <BlockChainProvider>
            <PaymentPageComponent/>
        </BlockChainProvider>
    )
}


