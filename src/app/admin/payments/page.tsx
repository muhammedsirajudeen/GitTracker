'use client'
import PaymentPageComponent from "@/components/PaymentPageComponent";
import { BlockChainProvider } from "@/components/wallet/BlockChainProvider";

//fix: convert this to a server component
export default   function PaymentsPage(){
    // const user=await GetUserGivenAccessToken(cookies())
    // console.log(user)
    // if(user && user.role==="admin"){
    //     redirect('/adminhome')
    // }else if(user){
    //     redirect("/home")
    // }
    return(
        <BlockChainProvider>
            <PaymentPageComponent/>
        </BlockChainProvider>
    )
}


