import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    username: {type: String, required: true},
    message: {type: String, required: true},
});

export const MessageModel = mongoose.model("messages", MessageSchema)