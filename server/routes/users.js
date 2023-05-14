import express from "express";
import {UserModel} from "../models/Users.js";
import {authenticateJWT} from "./auth.js";

const router = express.Router();



router.get("/user", authenticateJWT, async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send({ user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});



export {router as userRouter};