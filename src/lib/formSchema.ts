import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 6 characters.",
    }),
})


export const bountyFormSchema = z.object({
    issueId: z.string().nonempty(),
    ownerId: z.string().nonempty().min(24),
    repositoryId: z.string().nonempty().min(24),
    assignees: z.array(z.string().min(24)).optional(),
    description: z.string().nonempty().min(10),
    title: z.string().nonempty().min(5)
});