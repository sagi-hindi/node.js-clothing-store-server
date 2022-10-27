import ErrorModel from "../03-models/error-model";
import { IProductModel, ProductModel } from "../03-models/product-model";
import  {v4 as uuid} from "uuid";
import path from "path";



async function getAllProducts(qNew:string, qCategory:string):Promise <IProductModel[]> {
    if(qNew){
        console.log('new')
       return ProductModel.find({}).sort({createdAt: -1}).limit(1)
    }
    else if(qCategory){
        console.log(qCategory)
        return ProductModel.find({categories:{$in:[qCategory]}});
    }
    return ProductModel.find({}).exec();

}

async function getOneProduct(_id:string):Promise<IProductModel>{
    const product = await ProductModel.findById({_id}).exec();
    if(!product) throw new ErrorModel(404, "Product not found");
    return product;
}

async function addProduct(product:IProductModel):Promise<IProductModel> { 
    if(product.image){
        const extension = product.image.name.substring(product.image.name.lastIndexOf("."));
        product.imageName = uuid() + extension;
        await product.image.mv(path.join(__dirname, "..", "assets", "images", product.imageName));
        product.image = undefined; 
        const error = product.validateSync()
        if(error) throw new ErrorModel(400, error.message);
    }  
    return product.save();
}

async function updateProduct(product:IProductModel):Promise<IProductModel> { 
    if(product.image){
        const extension = product.image.name.substring(product.image.name.lastIndexOf("."));
        product.imageName = uuid() + extension;
        await product.image.mv(path.join(__dirname, "..", "assets", "images", product.imageName));
        product.image = undefined; 
        const error = product.validateSync()
        if(error) throw new ErrorModel(400, error.message);
    }  
    return ProductModel.findByIdAndUpdate(product._id, product, {new:true}).exec(); 

}

export default {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct
};

