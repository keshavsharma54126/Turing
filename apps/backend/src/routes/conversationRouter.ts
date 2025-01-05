import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
export const conversationRouter = Router();

conversationRouter.get("/", async(req:any, res:any) => {
    const conversations = await prisma.conversation.findMany();
    return res.status(200).json(conversations);
});