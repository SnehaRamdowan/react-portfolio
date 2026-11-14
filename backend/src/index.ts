import express from "express";
import {authRouter} from "./routes/auth.js";
import {manageRouter} from "./routes/manage.js";
import cors from "cors";
import helmet from "helmet";
import { connectRedis } from "./redis.js";
import { healthRouter } from "./routes/health.js";
import { publicRouter } from "./routes/public.js";
import { cvRouter } from "./routes/cv.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/public", publicRouter);
app.use("/api/cv", cvRouter);

app.use("/api/auth",authRouter);
app.use("/api/manage",manageRouter);
app.use((err:any,_req:any,res:any,_next:any)=>{console.error(err);res.status(500).json({error:"Erreur serveur"});});

async function start() {
  await connectRedis();
  app.listen(port, () => console.log(`API démarrée sur le port ${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
