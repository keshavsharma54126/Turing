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

export const testSchema = z.object({
    title:z.string().min(3),
    topic:z.string().min(3),
    difficulty:z.string().min(3).max(20),
    numQuestions:z.number(),
    pdfUrl:z.array(z.string()).default([]),
    urls:z.array(z.string()).default([])
})