import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/users/user.model";
import httpStatus from 'http-status-codes'
import { IsActive } from "../modules/users/user.interface";

export const checkAuth =(...authRoles:string[])=>async (req:Request,res:Response,next:NextFunction)=>{

  try {
      const accessToken = req.headers.authorization 

      if(!accessToken){
        throw new AppError(400,'No token')
      }

    const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload
    // const verifiedToken = jwt.verify(accessToken,"secret") as JwtPayload

     const isUserExist = await User.findOne({email:verifiedToken.email})
    
        if(!isUserExist){
            throw new AppError(httpStatus.BAD_REQUEST,"User doesnt exist")
        }
    
        if(isUserExist.isActive===IsActive.BLOCKED || isUserExist.isActive===IsActive.INACTIVE){
             throw new AppError(httpStatus.BAD_REQUEST,`User ${isUserExist.isActive}`)
        }
        if(isUserExist.isDeleted){
             throw new AppError(httpStatus.BAD_REQUEST,"User deleted")
        }
    

     console.log(verifiedToken);

    // if(!verifiedToken){
    //     throw new AppError(400,"age verify koren")
    // }

    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(400,"Youre not verified")

    }
   req.user=verifiedToken;
   
    next()
  } catch (error) {
   next(error) 
  }

}