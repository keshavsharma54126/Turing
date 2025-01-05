import {z} from "zod"

export const signupSchema = z.object({
    username:z.string().min(3).max(20),
    email:z.string().email(),
    password:z.string().min(8).max(20),
})

export const signinSchema = z.object({
    email:z.string().email(),
    password:z.string().min(8).max(20),
})