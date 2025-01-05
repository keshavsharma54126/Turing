import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
import { authMiddleware } from "../middleware/authMiddleware";
export const userRouter = Router();

userRouter.get("/",authMiddleware, async(req:any, res:any) => {
    try{
       const user = await prisma.user.findUnique({where:{id:req.userId}})
       return res.status(200).json({user})
    }catch(error){
        return res.status(500).json({message:"Internal server error",error})
    }
});