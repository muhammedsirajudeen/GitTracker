import { Priority } from "@/models/TaskManagement";
import { Transaction } from "@/models/Transaction";
import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().nonempty().min(8, {
        message: "Password must be at least 6 characters.",
    }),
})


export const bountyFormSchema = z.object({
    issueId: z.string().nonempty({
        message: "Issue ID cannot be empty.",
    }),

    description: z.string().nonempty({
        message: "Description cannot be empty.",
    }).min(10, {
        message: "Description must be at least 10 characters.",
    }),
    title: z.string().nonempty({
        message: "Title cannot be empty.",
    }).min(5, {
        message: "Title must be at least 5 characters.",
    }),
    bountyAmount: z.string().nonempty({
        message: "Bounty amount must be a positive number.",
    }),
});

export const adminFormSchema = z.object({
    email: z
        .string()
        .min(2, {
            message: "Email must be at least 2 characters.",
        })
        .max(50, {
            message: "Email must not exceed 50 characters.",
        }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export const taskSchema = z.object({
    taskTitle: z.string().min(1, "Task title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.nativeEnum(Priority),
    issueId: z.string().min(1, "Issue is required"),
  })
  

export type TaskFormValues = z.infer<typeof taskSchema>




export const TransactionSchema = z.object({
  fromAddress: z.string().min(1, "From address is required."),
  toAddress: z.string().min(1, "To address is required."),
  amount: z.number().min(0, "Amount must be a positive number."),
  date: z.string().default(() => new Date().toDateString()).optional(), // Default to the current date
  recieverId: z.string().min(1, "User ID is required."),
});
