import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { bountyFormSchema } from '@/lib/formSchema';
import axios, { AxiosError } from 'axios';
import { HttpStatus } from '@/lib/HttpStatus';
import { toast } from '@/hooks/use-toast';



type BountyFormValues = z.infer<typeof bountyFormSchema>;

const BountyForm: React.FC = () => {
    const form = useForm<BountyFormValues>({
        resolver: zodResolver(bountyFormSchema),
        defaultValues: {
            issueId: '',
            ownerId: '',
            repositoryId: '',
            assignees: [],
            description: '',
            title: ''
        }
    });

    const onSubmit = (data: BountyFormValues) => {
        console.log(data);

        const submitBounty = async () => {
            try {
                const response = await axios.post('/api/bounty/id', data, { withCredentials: true });
                console.log('Bounty submitted successfully:', response.data);
            } catch (error) {
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
        };

        submitBounty();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button style={{ borderRadius: '3px' }}>Issue Bounty</Button>
            </DialogTrigger>
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
                                <FormItem>
                                    <FormLabel>Issue ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ownerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="repositoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Repository ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assignees"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assignees</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Comma-separated list of assignee IDs"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.split(',').map(id => id.trim()))}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter assignee IDs separated by commas
                                    </FormDescription>
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
                        <Button type="submit">Submit Bounty</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default BountyForm;
