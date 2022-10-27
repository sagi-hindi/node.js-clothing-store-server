import { Document, model, Schema } from "mongoose";
import { UploadedFile } from 'express-fileupload';


export interface IProductModel extends Document {
    title: string;
    desc: string;
    image: UploadedFile;
    imageName: string;
    categories: [string];
    size: [string];
    color: [string];
    price: number;
    inStock: boolean;
    quantity?: number;

}

const ProductSchema = new Schema<IProductModel>({
    title: {
        type: String,
        required: true       
    },
    desc: {
        type: String,
        required: true       
    },
    image: {
        type: Object,
        required: false
    },
    imageName: {
        type: String,
        imageName: true
    },
    categories:{
        type: [String],
        required: true
    },
    size:{
        type: [String],
        required: true
    },
    color:{
        type: [String],
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    inStock:{
        type: Boolean,
        required: true,
        default: true
    },
    quantity:{
        type: Number,
    }
    

}, {
    versionKey: false,
    timestamps: true
});

export const ProductModel = model<IProductModel>("ProductModel", ProductSchema, "products");
