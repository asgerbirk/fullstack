import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser());
import {MessageModel} from "./models/Messages.js";



import cors from "cors"
app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_PORT,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));

import helmet from "helmet";
app.use(helmet());

import connectDB from "./database/connection.js";
connectDB()

import http from "http";
const server = http.createServer(app)

import { Server } from "socket.io"
import jwt from "jsonwebtoken";

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_PORT,
        credentials: true,
        methods: ["GET", "POST", "PATCH'", "DELETE"],
    },
});

io.on('connection', (socket) => {
    console.log('User connected');

    const token = socket.handshake.query.token;


    if (!token) {
        console.log('No token provided');
        socket.disconnect();
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            console.log('Invalid token:', err.message);
            socket.disconnect();
            return;
        }

        console.log('Decoded Token:', decoded);
        console.log('User authenticated:', decoded.username);

        socket.emit("user-details", decoded);

        socket.on("post-message", async (data) => {
            // Create a new message and save it in the database
            const newMessage = new MessageModel({username: data.username, message: data.message });
            const savedMessage = await newMessage.save();

            // Emit the 'display-message' event with the saved message's data
            io.emit("display-message", { username: savedMessage.username, message: savedMessage.message });
        });
    });
});




import {userRouter} from "./routes/userRouter.js";
app.use(userRouter)

import {authRouter} from "./routes/authRouter.js";
app.use(authRouter)

import {productRouter} from "./routes/productRouter.js";
app.use(productRouter)

import {cartRouter} from "./routes/cartRouter.js";
app.use(cartRouter)


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server is running on port", PORT));