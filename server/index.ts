import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;



app.use('/api/v1/auth', authRouter)



app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});