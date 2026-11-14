import { pool } from "./db.js";
import { redis } from "./redis.js";
export const sections = ["experiences","education","skills","projects"] as const;
export async function portfolio(id:number) {
 const u=await pool.query("SELECT id, email, slug, is_public FROM users WHERE id=$1",[id]);
 if(!u.rows.length) return null;
 const profile=(await pool.query("SELECT * FROM profiles WHERE user_id=$1",[id])).rows[0]||{};
 const result:any={...u.rows[0],profile};
 for(const section of sections) result[section]=(await pool.query(`SELECT * FROM ${section} WHERE user_id=$1 ORDER BY sort_order,id`,[id])).rows;
 return result;
}
export async function changed(id:number) {
 const r=await pool.query("UPDATE users SET data_version=data_version+1 WHERE id=$1 RETURNING slug",[id]);
 if(r.rows[0]) await redis.del(`portfolio:${r.rows[0].slug}`);
}
