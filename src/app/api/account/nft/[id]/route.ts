import { HttpStatus, HttpStatusMessage } from "@/lib/HttpStatus"
import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import axios from "axios";

export interface NftArray{
  name:string
  mintaddress:string
  symbol:string
  image:string
}

export async function GET(request:Request,{ params }: { params: { id: string } }){
    try {
        
        const {id}=params
        console.log(id)
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const userPublicKey = new PublicKey(id);
        const metaplex=new Metaplex(connection)
        const nfts = await metaplex.nfts().findAllByOwner({ owner: userPublicKey });
        const nftArray:NftArray[]=[]
        if (nfts.length > 0) {
            console.log(`Found ${nfts.length} NFTs for the owner:`);
            for(const nft of nfts){
              const imageUrl=await axios.get(nft.uri)
              console.log(imageUrl.data.image)
              nftArray.push({image:imageUrl.data.image,name:nft.name,symbol:nft.symbol,mintaddress:nft.address.toString()})
            }
          } else {
            console.log('No NFTs found for this wallet.');
          }
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.OK],nfts:nftArray},{status:HttpStatus.OK})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]},{status:HttpStatus.INTERNAL_SERVER_ERROR})
    }

}