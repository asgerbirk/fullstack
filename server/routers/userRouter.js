import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {UserModel} from "../models/Users.js";
import dotenv from "dotenv"
dotenv.config();


const router = express.Router();


function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    console.log(authHeader)
    console.log(token)

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log(decodedToken);
        req.user = decodedToken.user;
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(403);
    }
}


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


    //const accessToken = generateAccessToken(user)
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN, {expiresIn: "15m"})
    //const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN , {expiresIn: "1d"})

    res.send({accessToken: accessToken, user: username, password})
    console.log(accessToken)

});


//refresh token do not work - maybe check on this later.
router.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(400);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(400);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.sendStatus(400);
        //const accessToken = generateAccessToken({ name: user.username });
       const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN, {expiresIn: "30s"})
        res.send({ accessToken: accessToken });
    });
});

router.get('/user', authenticateJWT, async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: `welcome ${user.username}`});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

router.post("/forgotPassword", async (req, res) => {
    const {email} = req.body
try {
    const checkIfUserExist  = await UserModel.findOne({email})
    if (!checkIfUserExist) return res.sendStatus(404).send({message: "email does not exist"})
}catch (error){
        console.log(error)
}

})




export default router;