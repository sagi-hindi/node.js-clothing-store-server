import { IUserModel, UserModel } from './../03-models/user-model';
import ErrorModel from "../03-models/error-model";
import cyber from '../01-utils/cyber';
import CredentialsModel from '../03-models/credentials-model';

async function register(user:IUserModel):Promise <IUserModel> {

    const errors = user.validateSync();
    if(errors) throw new ErrorModel(400, errors.message);

    user.password = cyber.hash(user.password);  
    const addedUser = await UserModel.create(user);
    addedUser.password = undefined;
    console.log(addedUser);
    const token = cyber.getNewToken(addedUser);
    addedUser.accessToken = token;
    return addedUser;

}

async function login(credentials:CredentialsModel):Promise<IUserModel>{

    const errors = credentials.validateLogin();
    if(errors) throw new ErrorModel(400,errors);

    credentials.password = cyber.hash(credentials.password);
    const userLogin= await UserModel.findOne({username:credentials.username, password:credentials.password}).exec();
    if(!userLogin){
        throw new ErrorModel(401,`Incorrect username or password`)
    }
    userLogin.password = undefined; 
    const token = cyber.getNewToken(userLogin);
    userLogin.accessToken = token;

    return userLogin;
}

async function updateUser(user:IUserModel):Promise<IUserModel>{
    if(user.password){
        user.password = cyber.hash(user.password);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {new:true}).exec();
    updatedUser.password = undefined;

    return updatedUser;
}

async function deleteUser(_id:string):Promise<void>{
   const deletedUser = await UserModel.findByIdAndDelete(_id).exec();
   if(!deletedUser) throw new ErrorModel(404, "Product not found");
}

async function getUser(_id:string):Promise<IUserModel>{
    const user = await UserModel.findById(_id).exec();
    if(!user){throw new ErrorModel(404,`User not found`)}

    return user;
}

async function getAllUsers():Promise<IUserModel[]>{
  const users = await UserModel.find({}).exec();

    return users
}

async function getStats():Promise<IUserModel[]>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const stats = await UserModel.aggregate([
        {$match:{createdAt:{$gte:lastYear}}},
        {$project:{
            month:{$month:"$createdAt"},
        }},
        {$group:{
            _id:"$month",
            total:{$sum:1}
        }},
    ])
  
      return stats
  }
  






export default {
    register,
    login,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    getStats

};

