import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import path from "path"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {


   let errorSources:any = [{}]

    let statusCode = 500
    let message = "something went wrong"
    // duplicate error
    if (err.code == 1000) {
        const matchedArray = err.message.matche(/"([^"]*)"/)
        statusCode = 500;
        message = `${matchedArray[1]} already exists`
    }
    // CastError
    else if(err.name=="CastError"){
        statusCode = 400
        message = "Invalid object id"
    }
    else if(err.name=="ValidationError"){
        statusCode =500
        const errors = Object.values(err.errors)
        // const errorSources:any = [{}]
        errors.forEach((errorObject:any)=>errorSources.push({
            path:errorObject.path,
            message:errorObject.message
        }))
        message= err.message
    }
    // zod error
    else if(err.name=="ZodError"){
        
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(500).json({
        success: false,
        message: "error from error handler  ",
        errorSources,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null

    })
}
