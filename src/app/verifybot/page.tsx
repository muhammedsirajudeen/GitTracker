"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation';

export default function VerifyBotPage() {
const router=useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    // Simulate a verification process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsVerifying(false)
    setIsVerified(true)
    router.push('/clearcache');
}

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verify Human</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve detected unusual activity from your IP address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center text-amber-500">
            <AlertCircle size={48} />
          </div>
          <p className="text-center">
            To protect our services from automated requests, we need to verify that you&apos;re human.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isVerified ? (
            <Button 
              onClick={handleVerify} 
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? "Verifying..." : "Click here to verify"}
            </Button>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle size={24} className="text-green-500" />
              <p className="text-green-600 font-semibold">Verification successful!</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
