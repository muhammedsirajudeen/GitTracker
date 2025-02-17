import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage } from '@metaplex-foundation/js'; // Removed bundlrStorage import
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import axios from "axios";
import bs58 from "bs58"


export async function mintNFT(userAddress:string):Promise<string>{
    try {        
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const secretKey=JSON.parse(process.env.SOLANA_PAYER_PRIVATE as string)
        if(!secretKey){
            throw new Error('Payer secret key not found')
        }
        console.log(secretKey)
        // const payer=Keypair.fromSecretKey(bs58.decode(secretKey))

        if(secretKey.length!==64){
            throw new Error('Invalid secret key length')
        }
        // const decodedSecretKey = new Uint8Array(secretKey); // If it's already an array of numbers
        const payer=Keypair.fromSecretKey(bs58.decode("5tj6LL784Ar9AR62UVxcybr7QnvoLmmeYv7NroHWvKSrdDHSrwusxVKxbqcpnJFhBkaEJrkzYPL7pkURxS1N31Vz"))
        const userPublicKey=new PublicKey(userAddress)
 
        const metaplex=Metaplex.make(connection).use(keypairIdentity(payer)).use(
            irysStorage({
                address: 'https://devnet.irys.xyz', // Replace with the appropriate Irys endpoint
                providerUrl: 'https://api.devnet.solana.com',
                timeout: 60000,
              }
        ))
        //test till here
        const mint=await createMint(
            connection,
            payer,
            payer.publicKey,
            null,
            0
        )
        console.log('Mint created')
        console.log(userAddress)
        const userTokenAccount=await getOrCreateAssociatedTokenAccount(connection,payer,mint,userPublicKey)
        console.log(`User Token Account: ${userTokenAccount.address.toBase58()}`);
        const log=await mintTo(
            connection,
            payer,
            mint,
            userTokenAccount.address,
            payer.publicKey,
            1
        )
        console.log('Mint transaction',log)
        console.log(`Minted 1 NFT to User: ${userAddress}`);
        const metadata={
            name: 'Devnet Issue Completion NFT',
            symbol: 'ISSUE',
            description: 'Awarded for completing an issue on devnet!',
            image: 'https://pixcap.com/cdn/library/template/1717482087360/thumbnail/3D_NFT_Badge_Model_Of_The_Tokenization_transparent_800_emp.webp', // Replace with your NFT image URL
            attributes: [{ trait_type: 'Achievement', value: 'Issue Completed' }],
        }
        const backendUrl=process.env.BACKEND_URL
        if(!backendUrl){
            throw new Error("Backend env not found")
        }
        const metadataUriResponse=await axios.post(`${backendUrl}/ipfs`,metadata)
        const metadataUri=metadataUriResponse.data.hash
        if(!metadataUri){
            throw new Error("hash url not found")
        }        
        console.log(`Metadata URI: ${metadataUri}`);
        const { nft } = await metaplex.nfts().create({
            uri: metadataUri,
            name: 'Devnet Issue Completion NFT',
            sellerFeeBasisPoints: 0, // No royalties
            symbol: 'ISSUE',
            creators: [{ address: payer.publicKey, share: 100 }],
            // useExistingMint:mint
            
        });
        console.log(`NFT Minted Successfully: ${nft.address.toBase58()}`);
        return metadataUri;
    } catch (error) {
        console.log(error)
        return ""
    }
}
