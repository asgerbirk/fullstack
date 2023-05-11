import jwt from "jsonwebtoken";
import {UserModel} from "../models/Users.js";
import bcrypt from "bcrypt";
import express from "express";
import dotenv from "dotenv"
dotenv.config();


const router = express.Router();


router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})

    if (!user) {
        return res.status(404).send({message: "No user with that username - you need to register"})
    }

    const checkIfPasswordValidation = await bcrypt.compare(password, user.password)

    if (!checkIfPasswordValidation) {
        return res.status(404).send({message: "Password or username is not valid"})
    }

//when you sign then you sign some data. you say id = user_id, then you have to put a secret for the token.
// our secret is some numbers and letters that can be converted into the user.id object. The secret should be used when we verify if the user is authenticated.

    const accessToken = jwt.sign({username: user.username, id: user._id}, process.env.ACCESS_TOKEN, {expiresIn: "10m"})

    res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: false, // Set secure flag to false for development or when not using HTTPS
    });

    res.send({accessToken, user: username, password})
    console.log(accessToken)
});

    router.post("/register", async (req, res) => {
        const {username, email, password} = req.body;
        const user = await UserModel.findOne({username})

        if (user){
            return res.status(404).send({message: "Username already exist"})
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new UserModel({username, email, password: hashedPassword});
        await newUser.save()


        res.send({message: "User created"});
    })


router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.sendStatus(200);
});


export function authenticateJWT(req, res, next) {
    const token = req.cookies.jwt; // Retrieve the token from the 'jwt' cookie

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decodedToken; // Set the decoded token directly as req.user
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(403);
    }
}

export {router as authRouter}



