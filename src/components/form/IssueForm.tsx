"use client"

import { Dialog } from '@radix-ui/react-dialog'
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
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
import { Paperclip, X } from 'lucide-react'
import Image from 'next/image'
import { backendUrl } from '@/lib/backendUrl'

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    description: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
})

type IssueFormValues = z.infer<typeof issueSchema>


interface IssueFormProps {
    setIssues: Dispatch<SetStateAction<GitHubIssue[]>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    issue?: GitHubIssue
    method?: string
}

const IssueForm: React.FC<IssueFormProps> = ({ setIssues, open, setOpen, issue, method }) => {
    const form = useForm<IssueFormValues>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    })
    const fileRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        form.setValue('title', issue?.title ?? '')
        form.setValue('description', issue?.body ?? '')
    }, [form, issue?.body, issue?.title])
    const [loading, setLoading] = useState<boolean>(false)
    const { id } = useParams()
    const imageOne = useRef<HTMLImageElement>(null)
    const imageTwo = useRef<HTMLImageElement>(null)
    const imageThree = useRef<HTMLImageElement>(null)
    const filesArrayRef = useRef<File[]>([])
    const onSubmit = async (data: IssueFormValues) => {
        setLoading(true)
        //post to backend and get the urls
        const formData = new FormData()
        if (filesArrayRef.current) {
            for (const i of filesArrayRef.current) {
                formData.append("attachments", i)
            }
        }
        console.log(formData)
        const imageResponse = await axios.post(`${backendUrl}/attachments`, formData)
        //in the imageResponse.data.urls we have all the links available 
        console.log(imageResponse)
        const urls = imageResponse.data.urls as string[]
        urls.forEach((url, index) => {
            data.description = data.description + "\n" + `![attachment ${index}](${url})`
        })
        if (method === 'PUT') {
            try {
                const response = await axios.put(`/api/issues/${id}`, { ...data, issueNumber: issue?.number }, { withCredentials: true })
                console.log('Issue submitted successfully:', response.data)
                const issueResponse = response.data.issue as GitHubIssue
                if (response.status === HttpStatus.OK) {
                    setIssues(produce((draft: GitHubIssue[]) => {
                        draft.forEach((issue, index) => {
                            if (issue.number === issueResponse.number) {
                                draft[index] = issueResponse
                            }
                        })
                    }))
                    toast({ description: "Issue Updated successfully", className: "bg-green-500 text-white" })
                    setOpen(false)
                }

            } catch (error) {
                console.error('Error Updating issue:', error)
                toast({ description: "Error Updating issue", className: "bg-red-500 text-white" })
            }
            setLoading(false)
            return
        }
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
    function fileSelectHandler() {
        if (fileRef.current) {
            fileRef.current.click()
        }
    }
    function fileChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        if (filesArrayRef.current && filesArrayRef.current.length > 3) {
            toast({ description: 'Maximum three images allowed', className: 'bg-orange-500 text-white' })
            return
        }
        if (e.target.files) {
            const file = e.target.files[0]
            if (filesArrayRef.current) {
                filesArrayRef.current.push(file)
                const imageUrl = URL.createObjectURL(file)
                if (filesArrayRef.current.length === 1) {
                    if (imageOne.current) imageOne.current.src = imageUrl
                    // setImageCount(prev=>prev-1)
                }
                else if (filesArrayRef.current.length === 2) {

                    if (imageTwo.current) imageTwo.current.src = imageUrl
                    // setImageCount(prev=>prev-1)

                } else if (filesArrayRef.current.length === 3) {
                    if (imageThree.current) imageThree.current.src = imageUrl
                    // setImageCount(prev=>prev-1)

                }
            }
        }
        if (fileRef.current) fileRef.current.value = ''
        console.log(filesArrayRef.current)
    }
    function imageRemoveHandler(pos: number) {
        console.log(pos)
        if (pos === 1) {
            if (imageOne.current) imageOne.current.src = ''
        } else if (pos === 2) {
            if (imageTwo.current) imageTwo.current.src = ''

        } else if (pos === 3) {
            if (imageThree.current) imageThree.current.src = ''

        }
        if (pos < 4) {
            if (filesArrayRef.current) filesArrayRef.current.splice(pos - 1, 1)
        }
        console.log(filesArrayRef)
    }
    return (
        <Dialog open={open} onOpenChange={(status) => {
            setOpen(status)
        }}>
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
                                            className="resize-none h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div onClick={fileSelectHandler} className='mt-2 flex  justify-start items-center' >
                            <Paperclip color='grey' className='h-4 w-4' />
                            <p className='text-gray-500 text-xs' >Attach documents</p>
                        </div>
                        <Button disabled={loading} type="submit">
                            {
                                loading ?
                                    <ClipLoader color="black" loading={loading} size={20} />
                                    :
                                    <p>Submit Issue</p>
                            }
                        </Button>


                        <Input onChange={fileChangeHandler} ref={fileRef} type='file' className='hidden' />

                    </form>
                </Form>
                <div className='flex items-center justify-evenly w-full' >
                    <div className={` w-[120px] h-40  border border-gray-400 border-dashed `} >
                        <X onClick={() => imageRemoveHandler(1)} color='white' className='bg-red-700 absolute h-4 w-4 rounded-full' />
                        <Image src='' alt='attachments' height={10} className='h-40 rounded-xl' width={120} ref={imageOne} />
                    </div>

                    <div className={` w-[120px] h-40  border border-gray-400 border-dashed `} >
                        <X onClick={() => imageRemoveHandler(2)} color='white' className='bg-red-700 h-4 w-4 absolute rounded-full' />
                        <Image src='' alt='attachments' height={10} className='h-40 rounded-xl ' width={120} ref={imageTwo} />
                    </div>
                    <div className={` w-[120px] h-40  border border-gray-400 border-dashed `} >
                        <X onClick={() => imageRemoveHandler(3)} color='white' className='bg-red-700 h-4 w-4 absolute rounded-full' />
                        <Image src='' alt='attachments' height={10} className='h-40 rounded-xl ' width={120} ref={imageThree} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default IssueForm

