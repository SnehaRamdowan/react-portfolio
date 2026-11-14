import {Router} from "express";
import {pool} from "../db.js";
import {redis} from "../redis.js";
import {portfolio} from "../service.js";
export const publicRouter=Router();
publicRouter.get("/:slug",async(req,res)=>{const key=`portfolio:${req.params.slug}`;const cached=await redis.get(key);if(cached)return res.json(JSON.parse(cached));
 const r=await pool.query("SELECT id FROM users WHERE slug=$1 AND is_public=true",[req.params.slug]);if(!r.rows[0])return res.status(404).json({error:"Portfolio introuvable"});
 const data=await portfolio(r.rows[0].id);await redis.set(key,JSON.stringify(data),{EX:300});res.json(data);
});
