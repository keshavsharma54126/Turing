import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authMiddleware = (req: any, res: any, next: NextFunction) => {
   try{
       const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
     const decoded  = jwt.verify(token, JWT_SECRET) as {
        id:string,
        username:string,
        email:string
     };
   
     if(!decoded.id || !decoded.username || !decoded.email){
        return res.status(401).json({ message: "Unauthorized" });
     }
     req.userId = decoded.id;
     req.username = decoded.username;
     req.email = decoded.email;

    
    next();
   }catch(error){
    res.status(500).json({ message: "Internal server error" });
   }
};
