import { ProductModel } from '../03-models/product-model';
import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../02-middleware/verify-admin";
import verifyLoggedIn from "../02-middleware/verify-logged-in";
import productsLogic from '../05-logic/products-logic';
import path from 'path';


const router = express.Router();

router.get("/products",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const qNew = request.query.new;
        const qCategory = request.query.category;
        const users = await productsLogic.getAllProducts(qNew as string, qCategory as string);
        response.json(users);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/products/:_id",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const product = await productsLogic.getOneProduct(_id);
        response.json(product);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/products/add",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image
        const product = new ProductModel(request.body);
        const addedProduct = await productsLogic.addProduct(product);
        response.status(201).json(addedProduct);
    
    }
    catch (err: any) {
        next(err);
    }
});


router.put("/products/update/:id", verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body._id = request.params.id;
        request.body.image = request.files?.image
        const updateProduct = await productsLogic.updateProduct(request.body);
        response.json(updateProduct);

    }
    catch (err: any) {
        next(err);
    }
});


router.get("/products/images/:imageName",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageName);
        response.sendFile(absolutePath);

    }
    catch (err: any) {
        next(err);
    }
});



export default router;