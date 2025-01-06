import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
import { testSchema } from "../types/types";
import { ContentProcessorService } from "../services/contentProcessingService";
import { TestGenerationService } from "../services/testGenerationService";
export const testRouter = Router();

testRouter.post("/generate-test", async(req:any, res:any) => {
    const parsedBody = testSchema.parse(req.body);
    if(!parsedBody){
        return res.status(400).json({message:"Invalid request body"})
    }
    const {title, topic, difficulty, numQuestions, pdfUrl, urls} = parsedBody;
    const test = await prisma.test.create({data:{title, topic, difficulty, numQuestions, pdfUrl, urls, userId:req.userId}})


    return res.status(200).json({test})
});