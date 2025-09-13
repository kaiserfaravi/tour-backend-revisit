import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'

const createUser =async(payload:IUser)=>{

    const {email,password,...rest}=payload

    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User Already Exist");
    }

    const hashedPassword = await bcryptjs.hash(password as string,10)
    const authProvider:IAuthProvider = {provider:"credentials",providerId:email} 

     const user = await User.create({
        email,
        password:hashedPassword,
        ...rest,
        auths:[authProvider],
     })
        return user
}

const getAllUser =async()=>{
 const users = await User.find({})

 const totalUsers = await User.countDocuments();

 return {
    data:users,
    meta:{
        total:totalUsers
    }
 }
}

export const  userService ={
    createUser,getAllUser
}