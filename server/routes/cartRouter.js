import express from "express";
import {authenticateJWT} from "./authRouter.js";
import {CartModel} from "../models/Cart.js"; // Assuming you have created a Cart model

const router = express.Router();

router.post("/carts/:userId", authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    console.log("Adding to cart:", productId); // Log the productId

    try {
        // Find the cart associated with the user
        let cart = await CartModel.findOne({ user: userId });

        console.log("Cart found:", cart); // Log the cart

        // If the cart doesn't exist, create a new one
        if (!cart) {
            cart = new CartModel({ user: userId, items: [{ product: productId, quantity: 1 }] });
        } else {
            // If the cart exists, check if the item is already in the cart
            const checkDuplicateProductInCart = cart.items.findIndex(item => item.product.toString() === productId);

            if (checkDuplicateProductInCart > -1) {
                // If the item exists in the cart, send an error response
                return res.status(400).send({ message: "Product is already in the cart" });
            } else {
                // If the item doesn't exist in the cart, add a new item with quantity 1
                cart.items.push({ product: productId, quantity: 1 });
            }
        }

        // Save the cart
        await cart.save();

        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



router.get("/carts/:userId", authenticateJWT, async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await CartModel.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(400).send({ message: "Cart not found" });
        }

        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
export {router as cartRouter}