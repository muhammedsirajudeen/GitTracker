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
    ownerId: z.string().nonempty({
        message: "Owner ID cannot be empty.",
    }).min(24, {
        message: "Owner ID must be at least 24 characters.",
    }),
    repositoryId: z.string().nonempty({
        message: "Repository ID cannot be empty.",
    }).min(24, {
        message: "Repository ID must be at least 24 characters.",
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