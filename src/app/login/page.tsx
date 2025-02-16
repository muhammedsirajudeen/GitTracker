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
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PulseLoader from "react-spinners/ClipLoader";
import { ForgotPassword } from "@/serveractions/ForgotPassword";
import { loginFormSchema } from "@/lib/formSchema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, User } from "lucide-react";
import { frontendUrl } from "@/lib/backendUrl"


export default function LoginForm() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        setLoading(true)
        console.log(values)
        try {
            const response = (await axios.post('/api/auth/login',
                values,
            ))
            console.log(response)
            if (response.status === 200) {
                toast({ description: "user verified successfully", className: "bg-green-500 text-white" })
                setTimeout(() => window.location.href = "/home", 1000)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError
            if (axiosError.status === 404) {
                toast({ description: "please signup first", className: "bg-red-500 text-white" })
            } else if (axiosError.status === 401) {
                toast({ description: "invalid credentials", className: "bg-red-500 text-white" })
            } else {
                toast({ description: "please try again", className: "bg-red-500 text-white" })
            }
            setLoading(false)
        }

    }
    async function forgotHandler(){
        const email=form.getValues().email
        if(!email){
            toast({description:'Enter a email first',className:'bg-orange-500 text-white'})
            return
        }
        window.localStorage.setItem('forgot-email',email)
        //send email here and send the magic link and also add it to the cache and verify it that way
        toast({description:"Check your email",className:"bg-blue-500 text-white"})
        const status=await ForgotPassword(email)
        console.log(status)
        // setTimeout(()=>window.location.href='/forgot',1000)
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
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
                        This is your account email address.
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
                        Enter your account password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={forgotHandler}
                    className="text-sm text-gray-600"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Button 
                  disabled={loading} 
                  className="w-full" 
                  type="submit"
                >
                  {!loading ? (
                    <><User/><p>Login</p></>
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
          <CardFooter className="flex flex-col items-center">
            <Separator className="my-4" />
            <Button
              onClick={() => {
                window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=${frontendUrl}/api/auth/github&scope=repo`;
              }}
              variant="outline"
              className="w-full"
            >
              {/* <Image width={20} height={20} src="/github.png" alt="GitHub logo" className="mr-2" /> */}
              <Github/>
              Continue with GitHub
            </Button>
          </CardFooter>
        </Card>
      </div>
  
    )
}
