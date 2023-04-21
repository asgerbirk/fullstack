import express from "express";
import jwt from "jsonwebtoken";
import bcrypt  from "bcrypt";
import {UserModel} from "../models/Users.js";


const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})

    if (user){
        return res.status(404).send({message: "User already exist"})
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save()

    res.send({message: "User created"});
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})

    if (!user){
        return res.status(404).send({message: "No user with that username - you need to register"})
    }

    const checkIfPasswordValidation = await bcrypt.compare(password, user.password)

    if (!checkIfPasswordValidation){
       return  res.status(404).send({message: "Password or username is not valid"})
    }

//when you sign then you sign some data. you say id = user_id, then you have to put a secret for the token.
// our secret is some numbers and letters that can be converted into the user.id object. The secret should be used when we verify if the user is authenticated.
    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY)
    res.send({token, userID: user.id})

})

export default router;