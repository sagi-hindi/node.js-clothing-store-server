import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../02-middleware/verify-admin";
import verifyLoggedIn from "../02-middleware/verify-logged-in";
import { OrderModel } from '../03-models/order-model';
import orderLogic from "../05-logic/order-logic";

const router = express.Router();

router.post("/order/create", verifyLoggedIn || verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const order = new OrderModel(request.body);
        const addedOrder = await orderLogic.createOrder(order);
        response.json(addedOrder);
    }
    catch (err: any) {
        next(err);
    }
});

// update order
router.put("/order/:id", verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body._id = request.params.id;
        const updateOrder = await orderLogic.updateOrder(request.body);
        response.json(updateOrder);

    }
    catch (err: any) {
        next(err);
    }
});

// delete
router.delete("/order/delete/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = request.params.id;
        await orderLogic.deleteOrder(id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// get user orders
router.get("/order/find/:userId", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const orders = await orderLogic.getUserOrders(userId);
        response.json(orders);
    }
    catch (err: any) {
        next(err);
    }
});

// get all orders
router.get("/orders", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orders = await orderLogic.getAllOrders();
        response.json(orders);
    }
    catch (err: any) {
        next(err);
    }
});

//get monthly income
router.get("/orders/income", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const income = await orderLogic.getIncome();
        response.json(income);
    }
    catch (err: any) {
        next(err);
    }
});





export default router;