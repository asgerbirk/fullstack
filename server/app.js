import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());


import path from "path";
app.use(express.static(path.resolve("../server/dist")));



import cors from "cors"

app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_PORT,
    credentials: true,
}));

import helmet from "helmet";
app.use(helmet());

import connectDB from "./databases/connection.js";
connectDB()



import {userRouter} from "./routes/users.js";
app.use(userRouter)

import {authRouter} from "./routes/auth.js";
app.use(authRouter)



const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));