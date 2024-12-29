"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from 'next/image';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function LoginForm() {
    // ...
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div className="flex items-center justify-center flex-col">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex items-center justify-center flex-col mt-72">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input className="w-72" placeholder="Enter Your email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input className="w-72" placeholder="Enter your password" type="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please enter a strong password to continue.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button style={{borderRadius:"5px"}} className="rounded-md" type="submit">Submit</Button>
                </form>
            </Form>
            <hr className="text-gray-600 w-96 mt-10" />
            <Button onClick={()=>{
                window.location.href=`https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=http://localhost:3000/api/auth/github&scope=read:user`
            }} style={{borderRadius:"5px"}} className="mt-10 bg-black text-white" >Continue With Github
                <Image width={30} height={30} src="/github.png" alt="github login"/>
            </Button>
        </div>
    )
}
