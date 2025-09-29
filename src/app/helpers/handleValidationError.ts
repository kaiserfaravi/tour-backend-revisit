import mongoose from "mongoose"
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"

export const handleValidationError =(err:mongoose.Error.ValidationError):TGenericErrorResponse=>{
    
    const errorSources:TErrorSources[] =[]
        const errors = Object.values(err.errors)
        // const errorSources:any = [{}]
        errors.forEach((errorObject:any)=>errorSources.push({
            path:errorObject.path,
            message:errorObject.message
        }))
        return{
            statusCode:400,
            message:"Validation Error",
            errorSources
        }
}
