import express, { NextFunction, Request, Response } from "express";
import cyber from "../01-utils/cyber";
import verifyAdmin from "../02-middleware/verify-admin";
import verifyLoggedIn from "../02-middleware/verify-logged-in";
import { CartModel } from "../03-models/cart-model";
import cartLogic from "../05-logic/cart-logic";

const router = express.Router();

// create
router.post("/cart/create", verifyLoggedIn || verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const isOpen = true;
        const user = cyber.getUserFromToken(request.headers.authorization)
            const existingCart = await cartLogic.checkOpenCart(user._id,isOpen);
            if(existingCart){
                existingCart.products.push(request.body);
                const updateCart = await cartLogic.updateCart(existingCart);
                response.json(updateCart);
            }
            else{
                const cart = new CartModel();
                cart.userId = user._id;
                cart.products.push(request.body);
                const addedCart = await cartLogic.createCart(cart);
                response.status(201).json(addedCart);
            }

    }
    catch (err: any) {
        next(err);
    }
});

// update cart
router.put("/cart/:id", verifyLoggedIn || verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body._id = request.params.id;
        const updateCart = await cartLogic.updateCart(request.body);
        response.json(updateCart);

    }
    catch (err: any) {
        next(err);
    }
});

// delete
router.delete("/cart/delete/:id", verifyLoggedIn || verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = cyber.getUserFromToken(request.headers.authorization)
        const _id = request.params.id;
        await cartLogic.deleteProductCart(_id,user._id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// get one cart
router.get("/cart/find/:userId",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        console.log(userId);
       const cart = await cartLogic.getUserCart(userId);
        response.json(cart);
    }
    catch (err: any) {
        next(err);
    }
});

// get all carts
router.get("/carts", verifyLoggedIn || verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const carts = await cartLogic.getAllCarts();
        response.json(carts);
    }
    catch (err: any) {
        next(err);
    }
});






export default router;