import jwt from "jsonwebtoken";
import {UserModel} from "../models/Users.js";
import bcrypt from "bcrypt";
import express from "express";
import dotenv from "dotenv"
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();


const router = express.Router();

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})

    if (!user) {
        return res.status(404).send({message: "No user with that username - you need to register"})
    }

    if (!user.emailVerified) {
       return res.status(401).send({message: "Please verify your email before logging in"});
    }

    const checkIfPasswordValidation = await bcrypt.compare(password, user.password)

    if (!checkIfPasswordValidation) {
        return res.status(404).send({message: "Password or username is not valid"})
    }

//when you sign then you sign some data. you say id = user_id, then you have to put a secret for the token.
// our secret is some numbers and letters that can be converted into the user.id object. The secret should be used when we verify if the user is authenticated.

    const accessToken = jwt.sign({ username: user.username, id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });


    res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: false, // Set secure flag to false for development or when not using HTTPS
    });

    res.send({accessToken, user: username})
    console.log(accessToken)
});

    router.post("/register", async (req, res) => {
        const {username, email, password} = req.body;

        const user = await UserModel.findOne({username})
        if (user){
            return res.status(404).send({message: "Username already exist"})
        }

        const checkDuplicateEmail = await UserModel.findOne({email});
        if (checkDuplicateEmail){
            return res.status(400).send({message: "Email already exist"});
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const emailVerificationToken = crypto.randomBytes(20).toString("hex");


        const newUser = new UserModel({username, email, password: hashedPassword, emailVerificationToken, emailVerified: false});
        await newUser.save()

        // send email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: 
           http://localhost:5173/verify-email?token=${emailVerificationToken}`
        };

        transporter.sendMail(mailOptions, function(err) {
            if (err) {
                console.log('Error sending email: ', err);
                res.status(500).send({message: "Error sending email"});
            } else {
                res.send({message: "User created and verification email sent"});
            }
        });
    })

router.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    try {
        const user = await UserModel.findOne({ emailVerificationToken: token });

        if (!user) {
            console.log("Invalid or expired token");
            return res.status(404).send({ message: "Invalid or expired token" });
        }

        user.emailVerified = true;
        user.emailVerificationToken = null;
        await user.save();

        console.log("Email verified successfully");
        res.send({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});



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
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(403);
    }
}





export {router as authRouter}



