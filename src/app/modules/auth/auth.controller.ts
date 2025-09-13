import { NextFunction, Request, Response} from "express"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"

const credentialLogIn =catchAsync((req:Request,res:Response,next:NextFunction)=>{



     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User login succesfully",
        data:user,
        
    })
})

export const AuthControllers={
    credentialLogIn
}