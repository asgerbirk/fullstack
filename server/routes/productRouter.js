import multer from "multer";
import express from "express";
import {authenticateJWT} from "./authRouter.js";
import dotenv from 'dotenv';
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {ProductModel} from "../models/Products.js";
dotenv.config();


const router = express.Router();



 const s3 = new S3Client({
     credentials:{
         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
         accessKeyId: process.env.S3_ACCESS_KEY,
     },
    region: process.env.S3_REGION
});

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

router.post("/products", authenticateJWT, upload.array("images"), async (req, res) => {
    // console.log(req.files) // Now it's files (plural)

    // You'll need to iterate over the array of files
    let fileUrls = []; // Array to hold the file URLs

    for (let i = 0; i < req.files.length; i++) {
        let file = req.files[i];
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimeType,
        }
        const command = new PutObjectCommand(params)
        await s3.send(command)

        // Construct the file url and push it to the array
        const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${file.originalname}`;
        fileUrls.push(fileUrl);
    }

    // Save the product to the database
    const { name, description, price } = req.body;
    const newProduct = new ProductModel({ name, description, price, imageUrls: fileUrls, username: req.user.username, userId: req.user.id });
    await newProduct.save();

    res.status(200).send(newProduct);
});
/*
router.post("/products", authenticateJWT, upload.array("images"), async (req, res) => {
    console.log("req.body", req.body)
    console.log(req.file)



    req.file.buffer;

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimeType,
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)

    // Construct the file url
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${req.file.originalname}`;

    // Save the product to the database
    const { name, description, price } = req.body;
    const newProduct = new ProductModel({ name, description, price, imageUrl: fileUrl, username: req.user.username, userId: req.user.id   });
    await newProduct.save();

  res.status(200).send(newProduct);
});

 */

router.get("/products", async (req, res) => {
    try {
        const products = await ProductModel.find({})
        res.status(200).send(products)
    }catch (error){
        res.status(400).send({message: "Something went wrong",  error: error.message})
    }
})

router.get("/products/:userId", authenticateJWT, async (req, res) => {
    const { userId } = req.params;

    try {
        const products = await ProductModel.find({ username: userId });
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.patch("/products/:productId",authenticateJWT ,async (req, res) => {
    const productId = req.params.productId;
    const updatedProductData = req.body;

    try {
        // Find the product by ID
        const product = await ProductModel.findById(productId);
        console.log(product)

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update only the allowed fields
        Object.assign(product, updatedProductData);

        // Save the updated product
        const updatedProduct = await product.save();

        console.log('Product updated:', updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Failed to update the product:', error);
        res.status(500).json({ error: 'Failed to update the product' });
    }
});



router.delete("/products/:productId", authenticateJWT, async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(400).send({ message: "Product not found" });
        }

        await product.deleteOne();
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})



export {router as productRouter};