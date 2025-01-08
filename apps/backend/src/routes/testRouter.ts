import Router from "express";
import { prisma,VectorService, GeminiService, Prisma } from "@repo/db/client";
import { evaluateTestSchema, submitTestSchema, testSchema } from "../types/types";
import { ContentProcessorService } from "../services/contentProcessingService";
import { TestGenerationService } from "../services/testGenerationService";
import { authMiddleware } from "../middleware/authMiddleware";
export const testRouter = Router();

testRouter.post("/generate-test", authMiddleware, async(req:any, res:any) => {
   try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized - User ID not found" });
        }

        const parsedBody = testSchema.parse(req.body);
        console.log("Parsed body:", parsedBody);

        const {title, topic, difficulty, numQuestions, pdfUrl, urls} = parsedBody;
        const pdfUrlArray = Array.isArray(pdfUrl) ? pdfUrl : [];
        const urlsArray = Array.isArray(urls) ? urls : [];
        
        const test = await prisma.test.create({
            data: {
                title, 
                topic, 
                difficulty, 
                numQuestions, 
                pdfUrl: pdfUrlArray,
                urls: urlsArray,
                userId: req.userId,
                isCompleted: false,
            }
        });

        console.log("Test created:", test);

       const contentProcessingResult = await ContentProcessorService.processContent({
            userId: req.userId,
            testId: test.id,
            pdfUrls: pdfUrl ,
            urls: urls 
        })
        console.log(contentProcessingResult);
        const questions = await TestGenerationService.generateInteractiveTest(topic,numQuestions,difficulty as any,test.id);
        await prisma.test.update({
            where:{id:test.id},
            data:{
                title,
                topic,
                difficulty,
                numQuestions,
                questions
            }
        })
        console.log("Test created");
        return res.status(200).json({test})
   } catch(e) {
        console.error("Detailed error:", e);
        return res.status(400).json({
            message: "Internal server error",
            error: e,
            details: e instanceof Error ? e.message : "Unknown error"
        });
   }
});


testRouter.get("/get-test/:id", authMiddleware, async(req:any, res:any) => {
    try{
        const testId = req.params.id;
        const test = await prisma.test.findUnique({
            where:{id:testId},
            select:{
                id:true,
                userId:true,
                topic:true,
                title:true,
                difficulty:true,
                numQuestions:true,
                pdfUrl:true,
                urls:true,
                questions:true,
                isCompleted:true,
            }
        })

        if(!test){
            return res.status(400).json({message:"Test not found"})
        }
        const filteredQuestions = test.questions.map((question:any)=>{
            return {
                question:question.question,
                options:question.options,
                concept:question.concept,
                difficulty:question.difficulty,
                type:question.type
            }
        })
        test.questions =filteredQuestions
        return res.status(200).json({test})
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})

testRouter.delete("/delete-test/:id", authMiddleware, async(req:any, res:any) => {
    try{
        console.log("Deleting test")
        const testId = req.params.id;
        console.log(testId)
        const test = await prisma.test.deleteMany({where:{id:testId}})
        console.log(test)
        if(!test){
            return res.status(400).json({message:"Test not found"})
        }
        console.log("Test deleted")
        return res.status(200).json({message:"Test deleted",test})
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})

testRouter.post("/evaluate-test", authMiddleware, async(req:any, res:any) => {
    try{
        const parsedBody = await evaluateTestSchema.parse(req.body);
        if(!parsedBody){
            return res.status(400).json({message:"Invalid request body"})
        }
        const {testId, userAnswers} = parsedBody;
        const test = await prisma.test.findUnique({where:{id:testId},select:{
            id:true,
            userId:true,
            title:true,
            topic:true,
            difficulty:true,
            numQuestions:true,
            pdfUrl:true,
            urls:true,
            questions:true,
            answers:true,
            isCompleted:true,
        }})
        if(!test){
            return res.status(400).json({message:"Test not found"})
        }
        
        return res.status(200).json({test})
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})

testRouter.post("/submit-test", authMiddleware, async(req:any, res:any) => {
    try{
        const parsedBody = await submitTestSchema.parse(req.body);
        if(!parsedBody){
            return res.status(400).json({message:"Invalid request body"})
        }
        const {testId, userAnswers, score, isCompleted, isSubmitted, correctAnswers, incorrectAnswers, skippedAnswers} = parsedBody;

        const test = await prisma.test.findUnique({where:{id:testId}})
        if(!test){
            return res.status(400).json({message:"Test not found"})
        }
        await prisma.test.update({
            where:{
                id:testId
            },
            data:{
                isCompleted:true,
            }
        })
        const testResult = await prisma.testResult.create({
            data:{
                testId,
                userId:req.userId,
                userAnswers:Object.entries(userAnswers).map(([questionId, answer]) => ({ questionId, answer })),
                score,
                correctAnswers,
                incorrectAnswers,
                skippedAnswers
            }
        })
        return res.status(200).json({message:"Test submitted",testResult})
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})

testRouter.get("/get-test-results/:id", authMiddleware, async(req:any, res:any) => {
    try{
        const testId = req.params.id;
        const testResults = await prisma.testResult.findFirst({where:{testId},select:{
            userAnswers:true,
            score:true,
            correctAnswers:true,
            incorrectAnswers:true,
            skippedAnswers:true,
        }})
        return res.status(200).json({testResults})
    }catch(e){
        return res.status(400).json({message:"Internal server error",error:e})
    }
})

