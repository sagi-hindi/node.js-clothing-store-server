import { UserModel } from './user-model';
import { Document, model, Schema } from "mongoose";
import productCartModel from './product-cart-model';




export interface ICartModel extends Document {
    userId: Schema.Types.ObjectId;
    products: Array<productCartModel>;
    isOpen: boolean;
}




const CartSchema = new Schema<ICartModel>({
    userId: {
        type: Schema.Types.ObjectId,
    }, 
    products: [{
        _id:{
            type:Schema.Types.ObjectId,
        },
        quantity:{
            type:Number,
            default:1   
        },
        size:{
            type:String,
            required:true

        },
        color:{
            type:String,
            required:true

        },
        price:{
            type:Number,
            required:true
        },
        imageName:{
            type:String,
            required:true
        },
    }],
    isOpen: {   
        type: Boolean,
        default: true
    }
    
    
}, {
    versionKey: false, // Don't create __v field for versioning
    toJSON: { virtuals: true }, // When converting db to json - allow to bring virtual fields
    id: false, // Don't duplicate _id into id field
    timestamps: true // Create createdAt and updatedAt fields
    
});

// Virtual Fields:
CartSchema.virtual("user", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});


export const CartModel = model<ICartModel>("CartModel", CartSchema, "carts");
