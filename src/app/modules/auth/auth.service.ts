import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import {generateToken, verifyToken } from "../../utils/jwt";
import { createUserToken } from "../../utils/userTokens";
import { IsActive, IUser } from "../users/user.interface"
import { User } from "../users/user.model";
import bcryptjs from 'bcryptjs'
import httpStatus from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'

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

    // const jwtPayload ={
    //     userId:isUserExist.id,
    //     email:isUserExist.email,
    //     role:isUserExist.role

    // }

    // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)
    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })

    const userTokens = createUserToken(isUserExist)

   const {password:pass,...rest}= isUserExist.toObject()

 return{
        accessToken:userTokens.accessToken,
        refreshToken:userTokens.refreshToken,
        user:rest
}
}
const getNewAccessToken =async(refreshToken:string)=>{
    
    const verifiedRefreshToken = verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload;
    const isUserExist = await User.findOne({email:verifiedRefreshToken.email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User doesnt exist")
    }

    if(isUserExist.isActive===IsActive.BLOCKED || isUserExist.isActive===IsActive.INACTIVE){
         throw new AppError(httpStatus.BAD_REQUEST,`User ${isUserExist.isActive}`)
    }
    if(isUserExist.isDeleted){
         throw new AppError(httpStatus.BAD_REQUEST,"User deleted")
    }


    const jwtPayload ={
        userId:isUserExist.id,
        email:isUserExist.email,
        role:isUserExist.role

    }

    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)
    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })

    const userTokens = createUserToken(isUserExist)

   const {password:pass,...rest}= isUserExist.toObject()

 return{
        accessToken
}
}



export const AuthServices={
    credentialLogIn,getNewAccessToken
}