import { NextFunction, Request, Response} from "express"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appError"


const credentialLogIn =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{


    const loginInfo = await AuthServices.credentialLogIn(req.body)


     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User login succesfully",
        data:loginInfo,
        
    })
})
const getNewAccessToken =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST,"no refresh token recieved");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)


     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User login succesfully",
        data:tokenInfo,
        
    })
})
export const AuthControllers={
    credentialLogIn,getNewAccessToken
}