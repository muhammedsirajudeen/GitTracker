'use client'

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Filter } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { useWallet } from '@solana/wallet-adapter-react';
import { NftArray } from '@/app/api/account/nft/[id]/route';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface NftResponse {
  nfts: NftArray[]
}

export default function Achievements() {
  const { publicKey } = useWallet();
  const { data, isLoading }: { data: NftResponse | undefined, isLoading: boolean } = useSWR(`/api/account/nft/${publicKey}`, fetcher);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNfts = data?.nfts.filter(nft => 
    nft.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.mintaddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your NFT Collection</CardTitle>
        <CardDescription>Explore and showcase your unique digital assets.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <NftCollectionSkeleton />
        ) : data?.nfts.length ? (
          <>
            <CollectionStats nfts={data.nfts} />
            <div className="flex gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or address"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNfts?.map((nft, index) => (
                <NftCard key={index} nft={nft} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

function CollectionStats({ nfts }: { nfts: NftArray[] }) {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-secondary rounded-lg">
      <div>
        <h3 className="text-lg font-semibold">Collection Stats</h3>
        <p className="text-sm text-muted-foreground">Quick overview of your NFTs</p>
      </div>
      <div className="flex gap-4">
        <Badge variant="secondary" className="text-lg">
          {nfts.length} NFTs
        </Badge>
        <Badge variant="secondary" className="text-lg">
          {new Set(nfts.map(nft => nft.symbol)).size} Unique Collections
        </Badge>
      </div>
    </div>
  );
}

function NftCard({ nft }: { nft: NftArray }) {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-square">
        <Image
          src={nft.image}
          alt={nft.symbol}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300 ease-in-out group-hover:opacity-75"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{nft.symbol}</h3>
        <p className="text-sm text-muted-foreground truncate">{nft.mintaddress}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Image src="/placeholder.svg" alt="No NFTs" width={200} height={200} className="mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
      <p className="text-muted-foreground">Start collecting NFTs to see them displayed here.</p>
    </div>
  );
}

function NftCollectionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

