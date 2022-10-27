import { UserModel } from './user-model';
import { Document, model, Schema } from "mongoose";
import productCartModel from './product-cart-model';


export interface IOrderModel extends Document {
    userId: Schema.Types.ObjectId;
    products: Array<productCartModel>;
    amount: number;
    address: Object;
    status: string;
}


const OrderSchema = new Schema<IOrderModel>({
    userId: {
        type: Schema.Types.ObjectId,
    }, 
    products: [{
        productId:{type:String},
        quantity:{type:Number, default:1}
    }],
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status:{ type: String, required: true, default: "pending" }
    
}, {
    versionKey: false, // Don't create __v field for versioning
    toJSON: { virtuals: true }, // When converting db to json - allow to bring virtual fields
    id: false, // Don't duplicate _id into id field
    timestamps: true // Create createdAt and updatedAt fields
    
});

// Virtual Fields:
OrderSchema.virtual("user", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});


export const OrderModel = model<IOrderModel>("OrderModel", OrderSchema, "orders");
