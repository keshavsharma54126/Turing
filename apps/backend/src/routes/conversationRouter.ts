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
            select:{
                id:true,
                topic:true,
                userId:true,
                pdfUrl:true,
                url:true,
                messages:true,
                resources:{
                    select:{
                        id:true,
                        content:true,
                    }
                },
                
            }
            
        })
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
        const contentProcessingResult = await ContentProcessorService.processContent({
            userId: req.userId,
            conversationid:conversationId,
            pdfUrls: pdfUrl ,
            urls: urls 
        })
        console.log(contentProcessingResult)
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
        const{question,conversationId,chatHistory} = req.body;
        const relevantContext  = await VectorService.searchSimilarResourcesByConversation(question,5,0.6,conversationId)
        

        const contextString = relevantContext && Array.isArray(relevantContext) 
            ? relevantContext.map((doc: any) => doc.content).join('\n\n')
            : '';

        const systemPrompt = `You are an intelligent and helpful AI tutor focused on providing clear, accurate explanations.

            Instructions:
            - Use the provided context to answer the question accurately
            - If the context doesn't contain enough information, say so
            - Break down complex concepts into simpler terms
            - Use examples when helpful
            - Stay focused on the question asked
            - Cite specific parts of the context when relevant
            -I am also provigin you with the chat history in the context .with user answers and "ai" answers that are you answers so please keep thos in mind and then answer .
            -if there  is no context given then explicity tell the user that there is no context for this and would ask them if they would like for you to use your own knowledgebase of not.
            -If they say yes then use your own knowledge base to answer the question
            -if they say no then doh't .

            Context:
            ${contextString+JSON.stringify(chatHistory)}

            Remember to be concise yet thorough in your explanations.`;

        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        const stream = await GeminiService.genertaeStreamedResponse(question, systemPrompt);

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

conversationRouter.post("/updateChatHistory",authMiddleware,async(req:any,res:any)=>{
    try{
        const {chatHistory,conversationId} = req.body;
        console.log(chatHistory)
        if(!chatHistory){
            return res.status(400).json({
                message:"chat history is not present"
            })
        }
        const conversation  = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            }
        })

        if(!conversation){
            return res.status(400).json({
                message:"no conversation found with the given conversation Id"
            })
        }

        const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
        const newMessages = Array.isArray(chatHistory) ? [...messages, ...chatHistory] : messages;

        const response = await prisma.conversation.update({
            where:{
                id:conversationId
            },
            data:{
                messages:newMessages
            }
        })
        if(!response){
            return res.status(400).json({
                messages:"could not uddate messages with chathistory"
            })
        }
        return res.status(200).json({
            messages:"updated chat messages with the chat history",
            response
        })
    }catch(err){
        console.error("could not update chathistory",err)
        return res.status(500).json({
            error:"could not update chat history",err
        })
    }
})