import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    items: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
        quantity: {type: Number, default: 1}
        }
    ]
});
export const CartModel = mongoose.model("carts", CartSchema)