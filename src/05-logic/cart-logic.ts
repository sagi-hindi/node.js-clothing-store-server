import { CartModel, ICartModel } from './../03-models/cart-model';
import ErrorModel from "../03-models/error-model";



async function createCart(cart:ICartModel):Promise <ICartModel> {
    const error = cart.validateSync();
    if(error) throw new ErrorModel(400, error.message);
    return cart.save();

}

async function deleteProductCart(_id:string,userId:string):Promise<void>{
    const isOpen = true;
    console.log(_id)
    const cart = await CartModel.findOne({userId,isOpen}).exec();
    if(!cart) throw new ErrorModel(404, "Cart not found");
    const productsArray = cart.products.filter(product => product._id.toString() !== _id );
    cart.products = productsArray;
    console.log(productsArray)
    await CartModel.findByIdAndUpdate(cart._id, cart, {new:true}).exec(); 
}

async function getUserCart(userId:string):Promise<ICartModel> { 
    const cart = await CartModel.findOne({userId:userId}).exec();
        // const error = cart.validateSync()
        // if(error) throw new ErrorModel(400, "Cart not found");
        return cart;
    }  
async function checkOpenCart(userId:string,isOpen:boolean):Promise<ICartModel>{
    let cart = await CartModel.find({userId,isOpen}).exec(); 
    return cart[0];
     
}


async function updateCart(cart:ICartModel):Promise<ICartModel> { 
        const error = cart.validateSync()
        if(error) throw new ErrorModel(400, error.message);
      
    return CartModel.findByIdAndUpdate(cart._id, cart, {new:true}).exec(); 
}

async function getAllCarts():Promise<ICartModel[]> { 
    const carts = await CartModel.find({}).exec();  
    return carts;
}





export default {
    updateCart,
    createCart,
    deleteProductCart,
    getUserCart,
    getAllCarts,
    checkOpenCart

};

