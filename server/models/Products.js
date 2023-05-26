import mongoose, {Schema} from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrls: [{ type: String, required: false }],
    username: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true }
})

export const ProductModel = mongoose.model("products", ProductSchema)