import Router from "express";
import { prisma } from "@repo/db/client";
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

userRouter.get("/tests",authMiddleware, async(req:any, res:any) => {
    try{
        const tests = await prisma.test.findMany({where:{userId:req.userId}})
        return res.status(200).json({tests})
    }catch(error){
        return res.status(500).json({message:"Internal server error",error})
    }
});

userRouter.get("/tests/:id",authMiddleware, async(req:any, res:any) => {
    try{
        const test = await prisma.test.findUnique({where:{id:req.params.id, userId:req.userId}})
        return res.status(200).json({test})
    }catch(error){
        return res.status(500).json({message:"Internal server error",error})
    }
});
userRouter.get("/conversation",authMiddleware,async(req:any,res:any)=>{
    try{
        console.log("h")
        const conversations  = await prisma.conversation.findMany({
          where: {
            userId: req.userId
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        console.log(conversations)

            return res.status(200).json({
                conversations
            })
        
    }catch(err){
        return res.status(500).json({
            message:"Internal server error",err
        })
    }
})