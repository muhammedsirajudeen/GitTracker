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
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"

const formSchema = z.object({
    otp: z.string()
        .min(5, { message: "OTP must be at least 5 numbers long." }),
})

export default function SignupForm() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const [canResend, setCanResend] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
        },
    })

    useEffect(() => {
        const storedEndTime = localStorage.getItem('otpTimerEnd');
        if (storedEndTime) {
            const remainingTime = Math.max(0, Math.floor((parseInt(storedEndTime) - Date.now()) / 1000));
            setTimer(remainingTime);
            setCanResend(remainingTime === 0);
        } else {
            setTimer(10);
            setCanResend(false);
            const endTime = Date.now() + 10000;
            localStorage.setItem('otpTimerEnd', endTime.toString());
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval)
                        setCanResend(true)
                        localStorage.removeItem('otpTimerEnd')
                        return 0
                    }
                    return prevTimer - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const email = window.localStorage.getItem('email')
            const response = await axios.post('/api/auth/otpverify', { otp: values.otp, email: email })
            console.log(response.data)
            if (response.status === 200) {
                toast({ description: "User created successfully", className: "bg-green-500 text-white font-bold" })
                setTimeout(() => window.location.href = '/login', 1000)
            }
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 409) {
                toast({ description: "User already exists", className: "bg-red-500 text-white font-bold" })
            } else {
                toast({ description: "Please try again", className: "bg-red-500 text-white font-bold" })
            }
        } finally {
            setLoading(false)
        }
    }

    const resendOTP = async () => {
        setLoading(true)
        try {
            const email = window.localStorage.getItem('email')
            const response = await axios.post('/api/auth/resendotp', { email: email })
            if (response.status === 200) {
                toast({ description: "OTP resent successfully", className: "bg-green-500 text-white font-bold" })
                setTimer(10)
                setCanResend(false)
                const endTime = Date.now() + 10000
                localStorage.setItem('otpTimerEnd', endTime.toString())
            }
        } catch (error) {
            console.log(error)
            toast({ description: "Failed to resend OTP", className: "bg-red-500 text-white font-bold" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center flex-col">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex items-center justify-center flex-col mt-60">
                    <h1 className="font-bold">VERIFY</h1>
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input type="number" className="w-72" placeholder="Enter Your OTP" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your OTP.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} style={{ borderRadius: "5px" }} className="rounded-md" type="submit">
                        {!loading ? (
                            <p>Submit</p>
                        ) : (
                            <ClipLoader
                                color={"black"}
                                loading={loading}
                                size={30}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        )}
                    </Button>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm">
                            {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive OTP?"}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resendOTP}
                            disabled={!canResend || loading}
                        >
                            Resend
                        </Button>
                    </div>
                </form>
            </Form>
            <hr className="text-gray-600 w-96 mt-10" />
            <p className="text-xs mt-4">
                Continue to <Link className="font-bold text-blue-700" href="/login">login</Link>
            </p>
        </div>
    )
}

