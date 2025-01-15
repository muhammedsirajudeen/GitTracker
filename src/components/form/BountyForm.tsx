import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { bountyFormSchema } from '@/lib/formSchema';
import axios, { AxiosError } from 'axios';
import { HttpStatus } from '@/lib/HttpStatus';
import { toast } from '@/hooks/use-toast';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '../RepositoryListing';
import { GitHubIssue } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { BountyWithId, BountyWithUser } from '../tabs/Bounties';



type BountyFormValues = z.infer<typeof bountyFormSchema>;

interface IssueResponse {
    status: number
    issues: GitHubIssue[]
}

const BountyForm: React.FC<{
    open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>, setBounties: Dispatch<SetStateAction<BountyWithUser[]>>
}> = ({ open, setOpen, setBounties }) => {
    const form = useForm<BountyFormValues>({
        resolver: zodResolver(bountyFormSchema),
        defaultValues: {
            issueId: '',
            description: '',
            title: '',
            bountyAmount: ''
        }
    });
    const { id } = useParams()
    const { data }: { data?: IssueResponse, isLoading: boolean } = useSWR(`/api/issues/${id}`, fetcher)
    const [loading, setLoading] = useState<boolean>(false)
    const onSubmit = (data: BountyFormValues) => {
        console.log(data);

        const submitBounty = async () => {
            setLoading(true)
            try {
                const response = await axios.post(`/api/bounty/${id}`, { ...data, repositoryId: id }, { withCredentials: true });
                console.log('Bounty submitted successfully:', response.data);
                toast({ description: "Bounty submitted successfully", className: "bg-green-500 text-white" })
                setBounties((prev)=>[...prev,response.data.bounty])
                form.reset()
                // keep it open temporarily
                setOpen(false)
            } catch (error) {
                console.log(error);
                const axiosError = error as AxiosError
                if (axiosError.status === HttpStatus.BAD_REQUEST) {
                    toast({ description: "Invalid data submitted", className: "bg-red-500 text-white" })
                } else if (axiosError.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                    toast({ description: "Internal server error", className: "bg-red-500 text-white" })
                } else if (axiosError.status === HttpStatus.CONFLICT) {
                    toast({ description: "Bounty already exists", className: "bg-red-500 text-white" })
                } else {
                    toast({ description: "Error submitting bounty", className: "bg-red-500 text-white" })
                }
            }
            setLoading(false)
        };

        submitBounty();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className='bg-black' >
                <DialogHeader>
                    <DialogTitle>Add Bounty</DialogTitle>
                    <DialogDescription>
                        Add a bounty to this issue to encourage others to work on it.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bounty title" {...field} />
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
                                        <Textarea placeholder="Describe the bounty" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issueId"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Issue ID</FormLabel>
                                    <Select
                                        onValueChange={(value) => form.setValue("issueId", value)}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an Issue" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <ScrollArea className="h-[300px]">
                                                {data?.issues?.map((issue) => (
                                                    <SelectItem key={issue.id} value={issue.id.toString()} className="py-2 px-3">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium">#{issue.number}</span>
                                                            <span className="truncate flex-1">{issue.title}</span>
                                                            <Badge variant={issue.state === "open" ? "default" : "secondary"}>
                                                                {issue.state}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </ScrollArea>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bountyAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bounty Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter bounty amount" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} type="submit">
                            {
                                loading ? <ClipLoader color='black' size={10} /> : 'Submit Bounty'
                            }
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default BountyForm;
