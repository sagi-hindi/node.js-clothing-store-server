import { OrderModel, IOrderModel } from './../03-models/order-model';
import ErrorModel from "../03-models/error-model";



async function createOrder(order:IOrderModel):Promise <IOrderModel> {
    const error = order.validateSync();
    if(error) throw new ErrorModel(400, error.message);
    return OrderModel.create(order);
}

async function deleteOrder(_id:string):Promise<void>{
    const deletedOrder = await OrderModel.findByIdAndDelete({_id}).exec();
    if(!deletedOrder) throw new ErrorModel(404, "Order not found");
}

async function getUserOrders(userId:string):Promise<IOrderModel[]> { 
    const orders = await OrderModel.find({userId:userId}).exec();        
        return orders;
    }  


async function updateOrder(order:IOrderModel):Promise<IOrderModel> { 
        const error = order.validateSync()
        if(error) throw new ErrorModel(400, error.message);
      
    return OrderModel.findByIdAndUpdate(order._id, order, {new:true}).exec(); 
}

async function getAllOrders():Promise<IOrderModel[]> { 
    return OrderModel.find({}).exec();;
}


async function getIncome():Promise<IOrderModel[]> { 
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    const income = await OrderModel.aggregate([
        {$match:{createdAt:{$gte:previousMonth}}},
        {$project:{
            month:{$month:"$createdAt"},
            sales:'$amount',
        }},
        {$group:{
            _id:"$month",
            total:{$sum: '$sales'}
        }},
    ]);
  
      return income
  }






export default {
    updateOrder,
    createOrder,
    deleteOrder,
    getUserOrders,
    getAllOrders,
    getIncome

};

