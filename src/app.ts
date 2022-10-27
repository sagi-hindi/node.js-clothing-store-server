
import dotenv from "dotenv";
dotenv.config(); // Read .env file into process.env
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import config from "./01-utils/config";
import errorsHandler from "./02-middleware/errors-handler";
import ErrorModel from "./03-models/error-model";
import dal from "./04-dal/dal";
import authControllers from "./06-controllers/auth-controller";
import productControllers from "./06-controllers/products-controller";
import cartControllers from "./06-controllers/cart-controller";
import orderControllers from "./06-controllers/orders-controller";
import path from "path";
dal.connect();

const server = express();

if (config.isDevelopment) server.use(cors());
server.use(express.json());
server.use(fileUpload());
server.use("/api/auth", authControllers);
server.use("/api", productControllers);
server.use("/api", cartControllers);
server.use("/api", orderControllers);

const frontendDir = path.join(__dirname, 'frontend'); 
server.use(express.static(frontendDir)) 


server.use("*", (request: Request, response: Response, next: NextFunction) => {
    if(config.isDevelopment) {
    next(new ErrorModel(404, "Route not found."));
    }
    else {
        const indexHtmlFile = path.join(__dirname, "frontend", "index.html");
        response.sendFile(indexHtmlFile);
    }
});

server.use(errorsHandler);

server.listen(process.env.PORT, () => console.log("Listening..."));
