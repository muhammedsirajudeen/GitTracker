'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, DollarSign } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BountyWithId } from './tabs/Bounties'

// interface Bounty {
//   _id: string;
//   issueId: string;
//   ownerId: string;
//   assignees: string[];
//   description: string;
//   title: string;
//   repositoryId: string;
//   bountyAmount: number;
// }


interface BountyResponse {
  bounties: BountyWithId[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BountyPageComponent() {
  const { data, error, isLoading } = useSWR<BountyResponse>('/api/bounty', fetcher)
  const [expandedBounty, setExpandedBounty] = useState<string | null>(null)

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load bounties. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data || data.bounties.length === 0) {
    return (
      <Alert>
        <AlertTitle>No bounties found</AlertTitle>
        <AlertDescription>
          There are currently no bounties available. Check back later or create a new bounty!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full flex items-center justify-center flex-col mt-2">
      {data.bounties.map((bounty) => (
        <Card key={bounty._id} className="overflow-hidden w-3/4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold truncate">{bounty.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <DollarSign className="h-4 w-4 mr-1 text-green-500" />
              <span className="font-bold text-green-500">${bounty.bountyAmount.toFixed(2)}</span>
            </div>
            <p className={`text-sm text-gray-500 ${expandedBounty === bounty._id ? '' : 'line-clamp-2'}`}>
              {bounty.description}
            </p>
            {bounty.description.length > 100 && (
              <button
                className="text-sm text-blue-500 mt-1 hover:underline focus:outline-none"
                onClick={() => setExpandedBounty(expandedBounty === bounty._id ? null : bounty._id)}
              >
                {expandedBounty === bounty._id ? 'Show less' : 'Show more'}
              </button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

