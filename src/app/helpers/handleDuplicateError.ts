import { TGenericErrorResponse } from "../interfaces/error.types"

 export const handleDuplicateError=(err:any):TGenericErrorResponse=>{

     const matchedArray = err.message.matche(/"([^"]*)"/)

     return {
        statusCode:400,
        message : `${matchedArray[1]} already exists`
     }
}