import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { generateAccessToken } from "../../utils/jwt";
import { IUser } from "../users/user.interface"
import { User } from "../users/user.model";
import bcryptjs from 'bcryptjs'
import httpStatus from 'http-status-codes'
import jwt from 'jsonwebtoken'

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

    const jwtPayload ={
        userId:isUserExist.id,
        email:isUserExist.email,
        role:isUserExist.role

    }

    const accessToken = generateAccessToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })

    return{
        accessToken
    }
}

export const AuthServices={
    credentialLogIn
}