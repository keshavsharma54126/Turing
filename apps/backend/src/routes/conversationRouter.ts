import Router from "express";
import { prisma } from "@repo/db/client";
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