import Router from "express";
import { prisma,VectorService, GeminiService } from "@repo/db/client";
import { signinSchema, signupSchema } from "../types/types";
import bcryptjs from "bcryptjs"
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken"

export const authRouter = Router();

authRouter.post("/signup", async(req:any, res:any) => {
    try{
        const parsedData = signupSchema.parse(req.body)
        if(!parsedData){
            return res.status(400).json({message:"Invalid data"})
        }
        const {username,email,password} = parsedData;
        const existingUser = await prisma.user.findUnique({where:{email}})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword = await bcryptjs.hash(password,10)

        const user = await prisma.user.create({data:{username,email,password:hashedPassword}})
        return res.status(200).json({message:"User created",user})

    }catch(error){
        return res.status(500).json({message:"Internal server error",error})
    }
});


authRouter.post("/signin", async(req:any, res:any) => {
    try{
        const parsedData = signinSchema.parse(req.body)
        if(!parsedData){
            return res.status(400).json({message:"Invalid data"})
        }
        const {email,password} = parsedData;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password,user.password as string)
        if(!isPasswordValid){
            return res.status(401).json({message:"Password is incorrect"})
        }
        const token = jwt.sign({id:user.id,username:user.username,email:user.email},JWT_SECRET,{expiresIn:"10h"})
        return res.status(200).json({message:"Sign in successful",token})
    }catch(error){
        return res.status(500).json({message:"Internal server error",error})
    }
});

authRouter.post("/google-signin", async(req:any, res:any) => {
    try{
        const parsedData  = req.body.decoded
        console.log("parsedData",parsedData)
        const user = await prisma.user.findUnique({
          where:{
            email:parsedData.email
          }
        })
        console.log("user",user)
        if(user){
          const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET);
          return res.status(200).json({
            token
          })
        }
        const newUser = await prisma.user.create({
          data:{
            email:parsedData.email,
            username:parsedData.name,
            password:"",
            role:"USER",
            profileImage:parsedData.picture,
            googleId:parsedData.sub
          }
        })
        console.log("newUser",newUser)
        const token = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, JWT_SECRET);
        return res.status(200).json({
          token
        })
  
      }catch(e){
        return res.status(400).json({
          message: "invalid data",
        });
      }
});

