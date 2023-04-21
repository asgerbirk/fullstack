import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const app = express();

app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.error(error));


import userRouter from "./routers/userRouter.js";
app.use("/auth", userRouter)


const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));