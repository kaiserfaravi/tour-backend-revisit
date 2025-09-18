import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/users/user.interface";
import { User } from "../modules/users/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes"

export const createUserToken=(user:Partial<IUser>)=>{

      const jwtPayload ={
            userId:user._id,
            email:user.email,
            role:user.role
    
        }
    
        const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    
        const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

        return{
            accessToken,refreshToken
        }
}

export const createNewAccessTokenWithRefreshToken =async (refreshToken:string)=>{

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

        return accessToken
}