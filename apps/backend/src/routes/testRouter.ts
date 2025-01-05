import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
export const testRouter = Router();

testRouter.get("/", async(req:any, res:any) => {
    const tests = await prisma.test.findMany();
    return res.status(200).json(tests);
});