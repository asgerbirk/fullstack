import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();
import connectDB from "./databases/connection.js";


const app = express();
app.use(express.json());

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_PORT,
    credentials: true,
}));

import helmet from "helmet";
app.use(helmet());

connectDB()



import userRouter from "./routers/userRouter.js";
app.use(userRouter)



const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));