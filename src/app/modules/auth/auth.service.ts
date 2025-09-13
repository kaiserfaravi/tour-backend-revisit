import AppError from "../../errorHelpers/appError";
import { IUser } from "../users/user.interface"
import { User } from "../users/user.model";
import bcryptjs from 'bcryptjs'
import httpStatus from 'http-status-codes'

const credentialLogIn =async(payload:Partial<IUser>)=>{

    const {email,password}= payload;
    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User not found")
    }
    const matchedpassword = await bcryptjs.compare(password as string,isUserExist.password as string)

    if(!matchedpassword){
        throw new AppError(httpStatus.BAD_REQUEST,"password not matched")
    }

    return{
        email:isUserExist.email
    }
}

export const AuthServices={
    credentialLogIn
}