import Router from "express";
import { GeminiService, prisma, VectorService } from "@repo/db/client";
import { authMiddleware } from "../middleware/authMiddleware";
import { addContextSchema } from "../types/types";
import { ContentProcessorService } from "../services/contentProcessingService";
export const conversationRouter = Router();

conversationRouter.get("/:convoid",authMiddleware,async(req:any,res:any)=>{
    try{
        const convoid = req.params.convoid
        console.log(convoid)
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: convoid
            },
            include:{
                resources:true
            }
            
        })
        console.log(conversation)
        if(!conversation){
            return res.status(200).json({
                message:"errro while getting resources for conversation"
            })
        }
        return res.status(200).json({
            conversation
        })
    }catch(err){
        return res.status(500).json({
            message:"error while getting resource for conversation"
        })
    }
})
conversationRouter.post("/newSession",authMiddleware,async(req:any,res:any)=>{
    try{
        const {topic} = req.body
    const newConversation = await prisma.conversation.create({
        data:{
            topic:topic,
            userId:req.userId
        }
    })
    if(newConversation){
        return res.status(200).json({
            convoId:newConversation.id
        })
    }
    }catch(error){
        return res.status(400).json({
            message:"error while creating a new sesson for the user"
        })
    }

})

conversationRouter.delete("/:convoid",authMiddleware,async(req:any,res:any)=>{
    try{
        const convoid = req.params.convoid;
        const conversation = await prisma.conversation.findUnique({
            where:{
                id:convoid
            }
        })
        if(!conversation){
            return res.status(400).json({
                message:"no converstaion found with the given convoid"
            })
        }

        await prisma.conversation.delete({
            where:{
                id:convoid
            }
        })

        return res.status(200).json({
            message:"conversation deleted sucessfully"
        })
    }catch(err){
        return res.statsu(500).json({
            message:"error while deleting the session",err
        })
    }
})

conversationRouter.post("/addContext",authMiddleware,async(req:any,res:any)=>{
    try{
        const parsedBody = addContextSchema.safeParse(req.body)
        if(!parsedBody.success){
            return res.status(400).json({message:"Invalid request body"})
        }

        const {pdfUrl, urls,conversationId} = parsedBody.data;
        console.log(pdfUrl,urls)

        const contentProcessingResult = await ContentProcessorService.processContent({
            userId: req.userId,
            conversationid:conversationId,
            pdfUrls: pdfUrl ,
            urls: urls 
        })

        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            }
        })
        if(!conversation){
            return res.status(200).json({
                message:"conversation was not found to add context to"
            })
        }
        await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                pdfUrl,
                url: urls
            }
        })

        if(!contentProcessingResult.success){
            return res.status(400).json({
                message:"context could not be added successfully"
            })
        }
        return res.status(200).json({
            message:"context added successfully"
        })

        
    }catch(err){
        return res.status(500).json({
            message:"could not add context",err
        })
    }
})

conversationRouter.post("/chat-stream",authMiddleware,async(req:any,res:any)=>{
    try{
        const{question,conversationId} = req.body;
        const relevantContext  = await VectorService.searchSimilarResourcess(question,20,0.7,conversationId)
        console.log(relevantContext)

        const contextString = relevantContext && Array.isArray(relevantContext) 
            ? relevantContext.map((doc: any) => doc.content).join('\n\n')
            : '';

        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        const stream = await GeminiService.genertaeStreamedResponse(question,`
            You are a helpful AI tutor. Use this context  answer the question,here is the given context:${contextString}
            and if the context String is empty then answer fro your own knowledge base please for the relevant topic
            `)

        const streamResponse = stream.stream
        for await (const chunk of streamResponse) {
            const text = chunk.text();
            res.write(`${JSON.stringify({text})}\n\n`);
        }

        res.end()

    }catch(err){
        console.error("error in chat stream",err)
        return res.status(500).json({
            error:"Stream processing failed"
        })
    }
})