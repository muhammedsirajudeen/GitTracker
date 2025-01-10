"use client"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WifiIcon, WifiOffIcon } from 'lucide-react'
import {  Connection } from '@solana/web3.js';
import { Skeleton } from "../ui/skeleton"


export default function WalletStatus({endpoint}:{endpoint:string}) {
    const { connected,publicKey } = useWallet()
    const [isAnimating, setIsAnimating] = useState(false)
    const [balance, setBalance] = useState<number | null>(null);    
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getBalance = async () => {
            if (publicKey) {
                const connection = new Connection(endpoint);
                const balance = await connection.getBalance(publicKey);
                setBalance(balance / 1e9); // Convert lamports to SOL
                setIsLoading(false)
            }
        };
    
        getBalance();
    }, [publicKey, endpoint]);
    
    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 500)
        return () => clearTimeout(timer)
    }, [connected])
    const formatBalance = (bal: number) => {
        return bal.toFixed(4)
      }
    return (
        <Card className="w-full max-w-xs">
            <CardContent className="p-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={connected ? "default" : "secondary"}
                                className={`w-full transition-all duration-500 ease-in-out ${isAnimating ? "scale-105" : "scale-100"
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
                    <>
                        <div className="mt-2 text-sm text-center text-muted-foreground">
                            Connected to Solana network
                        </div>
                        <Card className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-12 h-12 text-purple-600" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="64" cy="64" r="64" fill="currentColor" fillOpacity="0.1"/>
              <path d="M44.5 76.5L64 96.5L83.5 76.5M44.5 51.5L64 31.5L83.5 51.5" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Solana Balance</h2>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {balance !== null ? formatBalance(balance) : 'N/A'} SOL
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>                    </>
                )}
            </CardContent>
        </Card>
    )
}

