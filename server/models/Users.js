import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    emailVerified: {type: Boolean, default: false},
    emailVerificationToken: String,
})

//here we are sending the schema to be a collection and we give the name "users "
export const UserModel = mongoose.model("users", UserSchema)