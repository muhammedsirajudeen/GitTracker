import { Dispatch, SetStateAction } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import { Confetti } from "./Confetti"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "../ui/button"

interface NftData {
    attributes: Array<Record<string, unknown>>
    description: string
    image: string
    name: string
    status: number
    symbol: string
}

interface NftAchievedProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    nft: string
}

export default function NftAchieved({ open, setOpen, nft }: NftAchievedProps) {
    const { data, isLoading }: { data: NftData; isLoading: boolean } = useSWR(nft, fetcher)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-4">Achievement Unlocked!</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-black p-6 rounded-lg shadow-xl"
                    >
                        <div className="relative mb-4">
                            <div className="flex items-center justify-center w-full">
                                <Image src={"https://pixcap.com/cdn/library/template/1717482087360/thumbnail/3D_NFT_Badge_Model_Of_The_Tokenization_transparent_800_emp.webp"} alt={data?.name} height={100} width={100} />
                            </div>
                            <Badge className="absolute top-2 right-2 bg-yellow-400 text-black font-semibold">
                                {data?.symbol}
                            </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{data?.name}</h3>
                        <p className="text-purple-100 mb-4">{data?.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {data?.attributes.map((attr, index) => (
                                <div key={index} className="bg-white bg-opacity-20 p-2 rounded">
                                    <p className="text-xs text-purple-200">{Object.keys(attr)[0]}</p>
                                    <p className="text-sm font-semibold text-white">{Object.values(attr)[0] as string}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center w-full mt-4">
                            <Button onClick={()=>window.location.href="/account"}  variant={"outline"}>view</Button>
                        </div>
                    </motion.div>
                )}
            </DialogContent>
            {open && <Confetti />}
        </Dialog>
    )
}

