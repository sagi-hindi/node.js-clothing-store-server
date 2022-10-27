import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../02-middleware/verify-admin";
import verifyLoggedIn from "../02-middleware/verify-logged-in";
import CredentialsModel from "../03-models/credentials-model";
import { UserModel } from "../03-models/user-model";
import authLogic from "../05-logic/auth-logic";


const router = express.Router();

router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await authLogic.register(user);
        response.status(201).json(token);
    
    }
    catch (err: any) {
        next(err);
    }
});


router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new CredentialsModel(request.body);
        const token = await authLogic.login(user);
        response.json(token);
    
    }
    catch (err: any) {
        next(err);
    }
});


router.put("/:id", verifyLoggedIn || verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const updateUser = await authLogic.updateUser(request.body);
        response.json(updateUser);

    }
    catch (err: any) {
        next(err);
    }
});

router.delete("/:id", verifyLoggedIn || verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        await authLogic.deleteUser(request.params.id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});


router.get("/users/find/:id", verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = await authLogic.getUser(request.params.id);
        response.json(user);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/users", verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const query = request.query.new;
        const users = query ? await UserModel.find({}).sort({_id: -1}).limit(5) : await authLogic.getAllUsers();
        console.log(users);
        
        response.json(users);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/stats", verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const stats = await authLogic.getStats();
        
        response.json(stats);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;