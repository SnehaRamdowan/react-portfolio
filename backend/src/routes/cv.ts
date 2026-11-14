import {Router} from "express";
import PDFDocument from "pdfkit";
import {pool} from "../db.js";
import {redis} from "../redis.js";
import {auth} from "../auth.js";
import {portfolio} from "../service.js";
export const cvRouter=Router();cvRouter.use(auth);
async function pdf(data:any,template:string,selected:string[]):Promise<Buffer>{
 return new Promise((resolve,reject)=>{const doc=new PDFDocument({size:"A4",margin:44,bufferPages:true});const chunks:Buffer[]=[];doc.on("data",c=>chunks.push(c));doc.on("end",()=>resolve(Buffer.concat(chunks)));doc.on("error",reject);
 const modern=template==="modern",accent=modern?"#176b86":"#24344a";
 if(modern)doc.rect(0,0,595,128).fill(accent);
 doc.fillColor(modern?"#ffffff":accent).fontSize(23).font("Helvetica-Bold").text(data.profile.full_name||"CV",44,modern?45:44,{width:505});
 doc.fontSize(11).font("Helvetica").text(data.profile.headline||"",{width:505});
 if(modern)doc.y=146;else doc.moveDown();
 doc.fillColor("#444444").fontSize(9).text([data.profile.city,data.email,data.profile.phone,data.profile.github_url].filter(Boolean).join("  •  "),{width:505});doc.moveDown();
 const heading=(s:string)=>{doc.moveDown(.6).fillColor(accent).font("Helvetica-Bold").fontSize(12).text(s.toUpperCase());doc.moveDown(.3);};
 const line=(a:string,b:string)=>{doc.fillColor("#182a3a").font("Helvetica-Bold").fontSize(10).text(a);if(b)doc.fillColor("#555555").font("Helvetica").fontSize(9).text(b);doc.moveDown(.45);};
 if(selected.includes("bio")&&data.profile.bio){heading("Profil");doc.font("Helvetica").fontSize(10).fillColor("#333333").text(data.profile.bio);}
 if(selected.includes("skills")){heading("Compétences");doc.font("Helvetica").fontSize(10).fillColor("#333333").text(data.skills.map((s:any)=>s.name).join("  •  "));}
 if(selected.includes("projects")){heading("Projets");for(const x of data.projects)line(x.title,x.description||"");}
 if(selected.includes("experiences")){heading("Expériences");for(const x of data.experiences)line(`${x.position} — ${x.company}`,`${String(x.start_date).slice(0,10)} – ${x.end_date?String(x.end_date).slice(0,10):"Présent"} | ${x.description||""}`);}
 if(selected.includes("education")){heading("Formations");for(const x of data.education)line(`${x.degree} — ${x.school}`,x.description||"");}
 doc.end();});
}
async function respond(req:any,res:any,inline:boolean){const id=res.locals.userId;const t=req.query.template==="modern"?"modern":"classic";const valid=["bio","skills","projects","experiences","education"];
 const selected=String(req.query.sections||valid.join(",")).split(",").filter((x:string)=>valid.includes(x));
 const v=await pool.query("SELECT data_version FROM users WHERE id=$1",[id]);const key=`cv:${id}:${v.rows[0].data_version}:${t}:${selected.join("-")}`;
 let buffer:Buffer;const cached=await redis.get(key);if(cached)buffer=Buffer.from(cached,"base64");else{const data=await portfolio(id);buffer=await pdf(data,t,selected);await redis.set(key,buffer.toString("base64"),{EX:3600});}
 const data=await portfolio(id);const name=String(data.profile.full_name||"Portfolio").replace(/[^a-zA-ZÀ-ÿ0-9 ]/g,"").trim().replace(/ +/g,"_");
 res.setHeader("Content-Type","application/pdf");res.setHeader("Content-Disposition",`${inline?"inline":"attachment"}; filename="CV_${name}.pdf"`);res.send(buffer);
}
cvRouter.get("/preview",(req,res)=>{void respond(req,res,true).catch(()=>res.status(500).json({error:"Erreur PDF"}));});
cvRouter.get("/download",(req,res)=>{void respond(req,res,false).catch(()=>res.status(500).json({error:"Erreur PDF"}));});
