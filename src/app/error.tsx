"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-2 border-[#8A2BE2] bg-[#161B22] text-white shadow-lg shadow-[#8A2BE2]/20">
        <CardHeader className="text-center border-b border-[#30363D]">
          <CardTitle className="text-2xl font-bold text-[#8A2BE2] flex items-center justify-center gap-2">
            <AlertOctagon className="h-6 w-6" />
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 pt-6">
          <div className="p-4 bg-[#0D1117] rounded-lg border border-[#30363D]">
            <p className="text-sm text-gray-300 break-all font-mono">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={reset} className="bg-[#8A2BE2] hover:bg-[#9A3FF1] text-white border-none">
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

