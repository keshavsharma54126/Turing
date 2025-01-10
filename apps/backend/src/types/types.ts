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

export const evaluateTestSchema = z.object({
    testId:z.string(),
    userAnswers:z.record(z.string(),z.string()).optional()||z.array(z.record(z.string(),z.string())).optional()
})

export const submitTestSchema = z.object({
    testId:z.string(),
    userAnswers:z.record(z.string(),z.string()).optional()||z.array(z.record(z.string(),z.string())).optional() ,
    score:z.number(),
    isCompleted:z.boolean(),
    isSubmitted:z.boolean(),
    correctAnswers:z.number(),
    incorrectAnswers:z.number(),
    skippedAnswers:z.number()
})