"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export const searchFormSchema = z.object({
    query: z.string().min(2, {
      message: "Search query must be at least 2 characters.",
    }),
  })
  
type SearchFormValues = z.infer<typeof searchFormSchema>

export default function IssueSearch() {
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: "",
    },
  })

  function onSubmit(data: SearchFormValues) {
    setIsSearching(true)
    // Simulate search request
    console.log("Searching for:", data.query)
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-2">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[300px]  text-white placeholder-gray-400 focus:ring-gray-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="absolute mt-1 text-xs text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" disabled={isSearching}>
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </Form>
  )
}

