"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface WalletConnectProps {
  open: boolean
}

export default function WalletConnectWarning({ open }: WalletConnectProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = () => {
    setIsLoading(true)
    // Simulate connection process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/account")
    }, 1500)
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] bg-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            Connect Your Solana Wallet
          </DialogTitle>
          <DialogDescription className="text-purple-600 dark:text-purple-400">
            To access the full features of our Solana-based application, please connect your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 128 128" fill="none">
              <path d="M109.9 30.85L71.55 57.65L80.29 40.59L109.9 30.85Z" fill="#9945FF" />
              <path d="M109.9 30.85L80.3 40.59L71.55 57.65L93.25 49.39L109.9 30.85Z" fill="#7C3AED" />
              <path d="M18.1 30.85L56.45 57.65L47.71 40.59L18.1 30.85Z" fill="#9945FF" />
              <path d="M18.1 30.85L47.7 40.59L56.45 57.65L34.75 49.39L18.1 30.85Z" fill="#7C3AED" />
              <path d="M64 74.21L71.55 57.65L56.45 57.65L64 74.21Z" fill="#7C3AED" />
              <path d="M64 74.21L71.55 57.65L56.45 57.65L64 74.21Z" fill="#9945FF" />
            </svg>
          </motion.div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConnect}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

