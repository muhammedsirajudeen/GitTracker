"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import axios, { AxiosError } from "axios";
import { HttpStatus } from "@/lib/HttpStatus";
import { toast } from "@/hooks/use-toast";
import { adminFormSchema } from "@/lib/formSchema";
import { useState } from "react"
import { ClipLoader } from "react-spinners"
import { useRouter } from "next/navigation"


export default function AdminLoginPage() {
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof adminFormSchema>>({
        resolver: zodResolver(adminFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const router=useRouter()

    async function onSubmit(values: z.infer<typeof adminFormSchema>) {
        // Handle form submission
        console.log(values)
        setLoading(true)
        try {
            const response = await axios.post("/api/admin/login", values)
            if (response.status === HttpStatus.OK) {
                toast({ description: 'admin logged in successfully', className: 'bg-green-500 text-white' })
                router.push('/adminhome')
            }
        } catch (e) {
            const axiosError = e as AxiosError
            if (axiosError.status === HttpStatus.UNAUTHORIZED) {
                toast({ description: 'Invalid Credentials', className: "bg-red-500 text-white" })
            } else {
                toast({ description: "Please try again", className: "bg-red-500 text-white" })
            }
        }
        setLoading(false)

    }

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>
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
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                {
                                    loading ?
                                        <ClipLoader size={10} color="black" />
                                        :
                                        <p>Login</p>

                                }
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">Admin access only</p>
                </CardFooter>
            </Card>
        </div>
    )
}

