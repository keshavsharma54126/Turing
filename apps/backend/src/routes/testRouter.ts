import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
import { testSchema } from "../types/types";
import { ContentProcessorService } from "../services/contentProcessingService";
import { TestGenerationService } from "../services/testGenerationService";
import { Trophy } from "lucide-react";
export const testRouter = Router();

testRouter.post("/generate-test", async(req:any, res:any) => {
   try{
    const parsedBody = testSchema.parse(req.body);
    if(!parsedBody){
        return res.status(400).json({message:"Invalid request body"})
    }
    const {title, topic, difficulty, numQuestions, pdfUrl, urls} = parsedBody;
    const test = await prisma.test.create({data:{title, topic, difficulty, numQuestions, pdfUrl, urls, userId:req.userId}})

    await ContentProcessorService.processContent({
        userId: req.userId,
        testId: test.id,
        pdfUrls: pdfUrl ,
        urls: urls 
    })

    const questions = await TestGenerationService.generateInteractiveTest(topic,numQuestions,difficulty as any);
    await prisma.test.update({
        where:{id:test.id},
        data:{
            title,
            topic,
            difficulty,
            numQuestions,
            questions:JSON.stringify(questions)
        }
    })

    return res.status(200).json({test})
   }catch(e){
    return res.status(400).json({message:"Internal server error",error:e})
   }
});


testRouter.get("/get-test/:id", async(req:any, res:any) => {
    try{
        const test = await prisma.test.findUnique({where:{id:req.params.id}})
        if(!test){
            return res.status(400).json({message:"Test not found"})
        }
        return res.status(200).json({test})
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})

testRouter.post("/submit-test", async(req:any, res:any) => {
    try{
        const parsedBody = testSchema.parse(req.body);
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})