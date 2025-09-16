import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =(...authRoles:string[])=>async (req:Request,res:Response,next:NextFunction)=>{

  try {
      const accessToken = req.headers.authorization 

      if(!accessToken){
        throw new AppError(400,'No token')
      }

    const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload
    // const verifiedToken = jwt.verify(accessToken,"secret") as JwtPayload

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