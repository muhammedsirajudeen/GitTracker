"use client"

import { Dialog } from '@radix-ui/react-dialog'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
// import { Textarea } from '../ui/textarea'
import * as z from "zod"
import { Textarea } from '../ui/textarea'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { GitHubIssue } from '@/lib/types'
import { produce } from 'immer'
import { HttpStatus } from '@/lib/HttpStatus'
import { toast } from '@/hooks/use-toast'

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    description: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
})

type IssueFormValues = z.infer<typeof issueSchema>


interface IssueFormProps {
    setIssues: Dispatch<SetStateAction<GitHubIssue[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const IssueForm: React.FC<IssueFormProps> = ({ setIssues, open, setOpen }) => {
    const form = useForm<IssueFormValues>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    })
    const [loading, setLoading] = useState<boolean>(false)
    const { id } = useParams()
    const onSubmit = async (data: IssueFormValues) => {
        setLoading(true)
        try {
            const response = await axios.post(`/api/issues/${id}`, data, { withCredentials: true })
            console.log('Issue submitted successfully:', response.data)
            const issue = response.data.issue as GitHubIssue
            if (response.status === HttpStatus.CREATED) {
                setIssues(produce((draft: GitHubIssue[]) => {
                    draft.unshift(issue)
                }))
                toast({ description: "Issue submitted successfully", className: "bg-green-500 text-white" })
                setOpen(false)
            }

        } catch (error) {
            console.error('Error submitting issue:', error)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-black">
                <DialogHeader>
                    <DialogTitle>Add Issue to Your Repo</DialogTitle>
                    <DialogDescription>
                        Add an issue to your repository to keep track of tasks, enhancements, and bugs.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter issue title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the issue in detail"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} type="submit">
                            {
                                loading ?
                                    <ClipLoader color="black" loading={loading} size={20} />
                                    :
                                    <p>Submit Issue</p>
                            }
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default IssueForm

