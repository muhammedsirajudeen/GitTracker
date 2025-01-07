"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useRouter } from "next/router"
import { redirect } from "next/navigation"

const formSchema = z.object({
    password: z.string()
        .min(5, { message: "Email must be at least 5 number long." }),
    confirmpassword: z.string()
        .min(5, { message: "Email must be at least 5 number long." }),
    
    
    });


export default function Page() {
    let code:null|string=null
    if(typeof window!=="undefined"){
        const url=new URL(window.location.href)
        code=url.searchParams.get('code')
    }
    const { toast } = useToast()
    const [loading,setLoading]=useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmpassword:""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        console.log(values)
        if(values.password!==values.confirmpassword){
            toast({description:'Both passwords must match',className:"bg-red-500 text-white"})
            setLoading(false)
            return
        }
        
        try {
            const response=await axios.post('/api/auth/forgot',
                {
                    email:window.localStorage.getItem('forgot-email'),
                    uuid:code,
                    password:values.confirmpassword
                }
            )
            if(response.status===200){
                toast({description:'password changed successfully',className:'bg-green-500 text-white'})
                // setTimeout(()=>{
                //     window.location.href='/login'
                // },1000)
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
                    <h1 className="font-bold" >CHANGE YOUR PASSWORD</h1>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="w-72" placeholder="Enter your Password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your new password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmpassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="w-72" placeholder="Confirm your password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Confirm your password.
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
        </div>
    )
}
