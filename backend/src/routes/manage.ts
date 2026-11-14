import {Router} from "express";
import {pool} from "../db.js";
import {auth} from "../auth.js";
import {portfolio,sections,changed} from "../service.js";
export const manageRouter=Router();manageRouter.use(auth);
manageRouter.get("/me",async(_req,res)=>res.json(await portfolio(res.locals.userId)));
manageRouter.patch("/profile",async(req,res)=>{
 const allowed=["full_name","headline","bio","phone","city","linkedin_url","github_url","website_url","photo_url"];
 const entries=Object.entries(req.body).filter(([k,v])=>allowed.includes(k)&&(typeof v==="string"||v===null));
 if(!entries.length)return res.status(400).json({error:"Aucun champ valide"});
 await pool.query(`UPDATE profiles SET ${entries.map(([k],i)=>`${k}=$${i+1}`).join(",")} WHERE user_id=$${entries.length+1}`,[...entries.map(([,v])=>v),res.locals.userId]);await changed(res.locals.userId);res.json({ok:true});
});
manageRouter.patch("/visibility",async(req,res)=>{if(typeof req.body.is_public!=="boolean")return res.status(400).json({error:"Valeur invalide"});await pool.query("UPDATE users SET is_public=$1 WHERE id=$2",[req.body.is_public,res.locals.userId]);await changed(res.locals.userId);res.json({ok:true});});
const columns:Record<string,string[]>={experiences:["position","company","start_date","end_date","description","sort_order"],education:["degree","school","start_date","end_date","description","sort_order"],skills:["name","category","level","sort_order"],projects:["title","description","technologies","repo_url","demo_url","image_url","sort_order"]};
manageRouter.post("/:section",async(req,res)=>{const {section}=req.params;if(!sections.includes(section as any))return res.status(404).end();const fields=columns[section].filter(k=>Object.prototype.hasOwnProperty.call(req.body,k));if(!fields.length)return res.status(400).json({error:"Données manquantes"});
 try{const r=await pool.query(`INSERT INTO ${section}(user_id,${fields.join(",")}) VALUES($1,${fields.map((_,i)=>`$${i+2}`).join(",")}) RETURNING *`,[res.locals.userId,...fields.map(k=>req.body[k])]);await changed(res.locals.userId);res.status(201).json(r.rows[0]);}catch{res.status(400).json({error:"Vérifiez les champs et dates"});}});
manageRouter.put("/:section/:id",async(req,res)=>{const {section,id}=req.params;if(!sections.includes(section as any))return res.status(404).end();const fields=columns[section].filter(k=>Object.prototype.hasOwnProperty.call(req.body,k));if(!fields.length)return res.status(400).json({error:"Aucun champ"});
 try{const r=await pool.query(`UPDATE ${section} SET ${fields.map((k,i)=>`${k}=$${i+1}`).join(",")} WHERE id=$${fields.length+1} AND user_id=$${fields.length+2} RETURNING *`,[...fields.map(k=>req.body[k]),id,res.locals.userId]);if(!r.rowCount)return res.status(404).end();await changed(res.locals.userId);res.json(r.rows[0]);}catch{res.status(400).json({error:"Champs invalides"});}});
manageRouter.delete("/:section/:id",async(req,res)=>{const {section,id}=req.params;if(!sections.includes(section as any))return res.status(404).end();const r=await pool.query(`DELETE FROM ${section} WHERE id=$1 AND user_id=$2`,[id,res.locals.userId]);if(!r.rowCount)return res.status(404).end();await changed(res.locals.userId);res.json({ok:true});});
