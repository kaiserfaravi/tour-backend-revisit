import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"

export const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{

    let statusCode = 500
    let message ="something went wrong"
    if(err instanceof AppError){
        statusCode = err.statusCode
        message= err.message
    }else if(err instanceof Error){
        statusCode = 500;
        message= err.message
    }

    res.status(500).json({
        success:false,
        message:"error from error handler  ",
        err,
        stack:envVars.NODE_ENV === "development"?err.stack:null

    })
}
