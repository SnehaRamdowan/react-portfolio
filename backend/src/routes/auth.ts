import {Router} from "express";
import bcrypt from "bcryptjs";
import {pool} from "../db.js";
import {redis} from "../redis.js";
import {auth,session} from "../auth.js";
import {z} from "zod";
export const authRouter=Router();
const credentials=z.object({email:z.string().email(),password:z.string().min(8)});
authRouter.post("/register",async(req,res)=>{
 const parsed=credentials.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Courriel ou mot de passe invalide (8 caractères minimum)"});
 const {email,password}=parsed.data;const slug=(String(req.body.slug||email.split("@")[0])).toLowerCase().replace(/[^a-z0-9-]/g,"-").slice(0,80);
 try{const hash=await bcrypt.hash(password,12);const r=await pool.query("INSERT INTO users(email,password_hash,slug,is_public) VALUES($1,$2,$3,true) RETURNING id,slug",[email.toLowerCase(),hash,slug]);
 await pool.query("INSERT INTO profiles(user_id,full_name,headline) VALUES($1,$2,$3)",[r.rows[0].id,String(req.body.full_name||"Mon portfolio"),"Programmer Analyst"]);
 return res.status(201).json({token:await session(r.rows[0].id),slug:r.rows[0].slug});
 }catch(e:any){return res.status(409).json({error:"Courriel ou URL déjà utilisé"});}
});
authRouter.post("/login",async(req,res)=>{const parsed=credentials.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Identifiants invalides"});
 const r=await pool.query("SELECT * FROM users WHERE email=$1",[parsed.data.email.toLowerCase()]);
 if(!r.rows[0]||!(await bcrypt.compare(parsed.data.password,r.rows[0].password_hash)))return res.status(401).json({error:"Identifiants incorrects"});
 res.json({token:await session(r.rows[0].id),slug:r.rows[0].slug});
});
authRouter.post("/logout",auth,async(_req,res)=>{await redis.del(`session:${res.locals.token}`);res.json({ok:true});});
authRouter.patch("/password",auth,async(req,res)=>{const {oldPassword,newPassword}=req.body;if(typeof newPassword!=="string"||newPassword.length<8)return res.status(400).json({error:"8 caractères minimum"});
 const r=await pool.query("SELECT password_hash FROM users WHERE id=$1",[res.locals.userId]);if(!await bcrypt.compare(String(oldPassword),r.rows[0].password_hash))return res.status(403).json({error:"Ancien mot de passe incorrect"});
 await pool.query("UPDATE users SET password_hash=$1 WHERE id=$2",[await bcrypt.hash(newPassword,12),res.locals.userId]);res.json({ok:true});});
authRouter.delete("/account",auth,async(_req,res)=>{await pool.query("DELETE FROM users WHERE id=$1",[res.locals.userId]);await redis.del(`session:${res.locals.token}`);res.json({ok:true});});
