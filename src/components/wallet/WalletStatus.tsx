"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WifiIcon, WifiOffIcon } from 'lucide-react'

export default function WalletStatus() {
  const { connected } = useWallet()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [connected])

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={connected ? "default" : "secondary"}
                className={`w-full transition-all duration-500 ease-in-out ${
                  isAnimating ? "scale-105" : "scale-100"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {connected ? (
                    <WifiIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOffIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span>{connected ? "Connected" : "Not Connected"}</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{connected ? "Your wallet is connected" : "Connect your wallet to interact"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {connected && (
          <div className="mt-2 text-sm text-center text-muted-foreground">
            Connected to Solana network
          </div>
        )}
      </CardContent>
    </Card>
  )
}

