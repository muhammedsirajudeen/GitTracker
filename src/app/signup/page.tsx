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
import { HttpStatus } from "@/lib/HttpStatus";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { frontendUrl } from "@/lib/backendUrl"

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
            if (response.status === HttpStatus.CREATED) {
                toast({ description: "User created successfully", className: "bg-green-500 text-white font-bold" })
                window.localStorage.setItem('email',values.email)
                setTimeout(() => window.location.href = '/verify')
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            const axiosError = error as AxiosError
            if (axiosError.status === HttpStatus.CONFLICT) {
                toast({ description: "user already exists", className: "bg-red-500 text-white font-bold" })
            } else {
                toast({ description: "please try again", className: "bg-red-500 text-white font-bold" })
            }
        }



    }

    return (
        <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">SIGNUP</CardTitle>
            <CardDescription className="text-center">
              Create an account to get started
            </CardDescription>
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
                        <Input placeholder="Enter your password" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter a strong password to continue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  disabled={loading} 
                  className="w-full" 
                  type="submit"
                >
                  {!loading ? (
                    "Sign Up"
                  ) : (
                    <PulseLoader
                      color={"black"}
                      loading={loading}
                      size={8}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </div>
            <Separator className="my-4" />
            <Button
              onClick={() => {
                window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=${frontendUrl}/api/auth/github&scope=repo`;
              }}
              variant="outline"
              className="w-full"
            >
              <Github/>
              Continue with GitHub
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
}
