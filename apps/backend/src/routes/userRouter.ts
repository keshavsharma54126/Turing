import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
export const userRouter = Router();

userRouter.get("/", async(req:any, res:any) => {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
});