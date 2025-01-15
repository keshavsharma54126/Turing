import Router, { response } from "express";
import { prisma } from "@repo/db/client";
import { authMiddleware } from "../middleware/authMiddleware";
import { AnyZodTuple } from "zod";
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

userRouter.get("/getUserData",authMiddleware,async(req:any,res:any)=>{
    try{
        const userId = req.userId;
        const userData = await prisma.user.findUnique({
            where:{
                id:userId
            },
                select:{
                    email:true,
                    username:true,
                    testCount:true,
                    SessionQuerryCount:true,
                    profileImage:true,
                    subTier:true,
                    tests:{
                        select:{
                            id:true,
                            title:true,
                            topic:true,
                            difficulty:true,
                            numQuestions:true,
                            createdAt:true,
                            results:{
                                select:{
                                    id:true,
                                    score:true,
                                    correctAnswers:true,
                                    incorrectAnswers:true,
                                    skippedAnswers:true,
                                }
                            }
                        }
                    },
                    conversations:{
                        select:{
                            id:true,
                            topic:true,
                            createdAt:true,
                        }
                    }
                }
        })
        if(!userData){
            return res.status(400).json({
                message:"user does not exist"
            })
        }
        return res.status(200).json({
            userData
        })
    }catch(err){
        return res.status(500).json({
            message:"could not retrieve user data for their test ans their tutoring sessions"
        })
    }
})