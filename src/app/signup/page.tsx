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
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PulseLoader from "react-spinners/ClipLoader";

const formSchema = z.object({
    email: z.string()
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(128, { message: "Password must not exceed 128 characters." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character." }),
});


export default function SignupForm() {
    const { toast } = useToast()
    const [loading,setLoading]=useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        //from here we would post it directly to the backend
        setLoading(true)
        try {
            const response = (
                await axios.post('/api/auth/signup',
                    values,
                )
            )
            console.log(response)
            if (response.status === 201) {
                toast({ description: "User created successfully", className: "bg-green-500 text-white font-bold" })
                window.localStorage.setItem('email',values.email)
                setTimeout(() => window.location.href = '/verify')
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            const axiosError = error as AxiosError
            if (axiosError.status === 409) {
                toast({ description: "user already exists", className: "bg-red-500 text-white font-bold" })
            } else {
                toast({ description: "please try again", className: "bg-red-500 text-white font-bold" })
            }
        }



    }

    return (
        <div className="flex items-center justify-center flex-col">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex items-center justify-center flex-col mt-60">
                    <h1 className="font-bold" >SIGNUP</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input className="w-72" placeholder="Enter Your email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your email address.
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
                    <Button disabled={loading} style={{ borderRadius: "5px" }} className="rounded-md" type="submit">
                        {!loading?
                        <p>Submit</p>
                        :
                        <PulseLoader
                        color={"black"}
                        loading={loading}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />                        }

                    </Button>
                </form>
            </Form>
            <hr className="text-gray-600 w-96 mt-10" />
            <p className="text-xs mt-4" >continue to <Link className="font-bold text-blue-700" href={"/login"} >login</Link></p>
            <Button onClick={() => {
                window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=http://localhost:3000/api/auth/github&scope=repo`
            }} style={{ borderRadius: "5px" }} className="mt-4 bg-black text-white" >Continue With Github
                <Image width={30} height={30} src="/github.png" alt="github login" />
            </Button>
        </div>
    )
}
