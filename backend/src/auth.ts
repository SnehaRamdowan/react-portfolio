import { Request,Response,NextFunction } from "express";
import { redis } from "./redis.js";
import { randomBytes } from "node:crypto";
export async function session(userId:number){const token=randomBytes(32).toString("hex");await redis.set(`session:${token}`,String(userId),{EX:604800});return token;}
export async function auth(req:Request,res:Response,next:NextFunction){
 const token=req.header("authorization")?.replace(/^Bearer /i,"");
 if(!token)return res.status(401).json({error:"Connexion requise"});
 const id=await redis.get(`session:${token}`);
 if(!id)return res.status(401).json({error:"Session expirée"});
 res.locals.userId=Number(id);res.locals.token=token;next();
}
