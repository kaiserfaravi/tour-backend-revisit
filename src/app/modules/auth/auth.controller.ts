import { NextFunction, Request, Response} from "express"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"

const credentialLogIn =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{


    const loginInfo = await AuthServices.credentialLogIn(req.body)


     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User login succesfully",
        data:loginInfo,
        
    })
})

export const AuthControllers={
    credentialLogIn
}