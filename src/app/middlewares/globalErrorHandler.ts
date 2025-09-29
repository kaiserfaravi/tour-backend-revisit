import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import path from "path"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"
import { handleDuplicateError } from "../helpers/handleDuplicateError"
import { handleCastError } from "../helpers/handleCastError"
import { handleZodError } from "../helpers/handleZodError"
import { handleValidationError } from "../helpers/handleValidationError"

// export interface TErrorSources{
//     path:string,
//     message:string
// }

// interface TGenericErrorResponse {
//     statusCode:number,
//     message:string,
//     errorSources?:TErrorSources[]
// }

// const handleDuplicateError=(err:any):TGenericErrorResponse=>{

//      const matchedArray = err.message.matche(/"([^"]*)"/)

//      return {
//         statusCode:400,
//         message : `${matchedArray[1]} already exists`
//      }
// }

// const handleCastError =(err:mongoose.Error.CastError):TGenericErrorResponse=>{
//     return{
//          statusCode : 400,
//         message : "Invalid object id"
//     }
// }

// const handleValidationError =(err:mongoose.Error.ValidationError):TGenericErrorResponse=>{
    
//     const errorSources:TErrorSources[] =[]
//         const errors = Object.values(err.errors)
//         // const errorSources:any = [{}]
//         errors.forEach((errorObject:any)=>errorSources.push({
//             path:errorObject.path,
//             message:errorObject.message
//         }))
//         return{
//             statusCode:400,
//             message:"Validation Error",
//             errorSources
//         }
// }

// const handleZodError =(err:any):TGenericErrorResponse=>{
//      const errorSources:TErrorSources[] =[]

     
//         err.issues.forEach((issue:any)=>{
//             errorSources.push({
//                 path:issue.path[issue.path.length-1],
//                 message:issue.message
//             })
//         })
//         return{
//             statusCode:400,
//             message:"Zod error",
//             errorSources
//         }
// }

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {


   let errorSources:TErrorSources[] = []

    let statusCode = 500
    let message = "something went wrong"
    // duplicate error
    if (err.code == 1000) {
        // const matchedArray = err.message.matche(/"([^"]*)"/)
        const simplifiedError = handleDuplicateError(err)
        // statusCode = 500;
        statusCode = simplifiedError.statusCode
        // message = `${matchedArray[1]} already exists`
        message = simplifiedError.message
    }
    // CastError
    else if(err.name=="CastError"){
       
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    else if(err.name=="ValidationError"){

         const simplifiedError =handleValidationError(err)

         statusCode = simplifiedError.statusCode
         errorSources = simplifiedError.errorSources as TErrorSources[]
         message = simplifiedError.message

        // statusCode =500
        // const errors = Object.values(err.errors)
        // // const errorSources:any = [{}]
        // errors.forEach((errorObject:any)=>errorSources.push({
        //     path:errorObject.path,
        //     message:errorObject.message
        // }))
        // message= err.message
    }
    // zod error
    else if(err.name=="ZodError"){

        const simplifiedError = handleZodError(err)
        statusCode =simplifiedError.statusCode
        message =simplifiedError.message
        errorSources =simplifiedError.errorSources as TErrorSources[]
        // err.issues.forEach((issue:any)=>{
        //     errorSources.push({
        //         path:issue.path[issue.path.length-1],
        //         message:issue.message
        //     })
        // })
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
        err:envVars.NODE_ENV === "development"?err:null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null

    })
}
