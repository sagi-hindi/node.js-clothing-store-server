import { Document, model, Schema } from "mongoose";

export interface IUserModel extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    accessToken: string;
}

const UserSchema = new Schema<IUserModel>({
    username: {
        type: String,
        required: true       
    },
    email: {
        type: String,
        required: true       
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    accessToken: {
        type: String,
        required: false
    }


}, {
    versionKey: false,
    timestamps: true
});

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");
