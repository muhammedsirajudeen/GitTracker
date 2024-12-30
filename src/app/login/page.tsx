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
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PulseLoader from "react-spinners/ClipLoader";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function LoginForm() {
    const {toast}=useToast()
    const [loading,setLoading]=useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password:""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        console.log(values)
        try {
            const response=( await axios.post('/api/auth/login',
                values,
            ))
            console.log(response)
            if(response.status===200){
                toast({description:"user verified successfully",className:"bg-green-500 text-white"})
                setTimeout(()=>window.location.href="/home",1000)
            }          
            setLoading(false)  
        } catch (error) {
            console.log(error)
            const axiosError=error as AxiosError
            if(axiosError.status===404){
                toast({description:"please signup first",className:"bg-red-500 text-white"})
            }else if(axiosError.status===401){
                toast({description:"invalid credentials",className:"bg-red-500 text-white"})
            }else{
                toast({description:"please try again",className:"bg-red-500 text-white"})
            }
            setLoading(false)
        }

    }

    return (
        <div className="flex items-center justify-center flex-col">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex items-center justify-center flex-col mt-72">
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
            <Button onClick={()=>{
                window.location.href=`https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=http://localhost:3000/api/auth/github&scope=read:user`
            }} style={{borderRadius:"5px"}} className="mt-10 bg-black text-white" >Continue With Github
                <Image width={30} height={30} src="/github.png" alt="github login"/>
            </Button>
        </div>
    )
}
