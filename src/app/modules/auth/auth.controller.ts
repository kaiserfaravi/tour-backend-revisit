import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookies } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserToken } from "../../utils/userTokens"
import { envVars } from "../../config/env"


const credentialLogIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const loginInfo = await AuthServices.credentialLogIn(req.body)
    //  res.cookie('accessToken',loginInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })
    // res.cookie('refreshToken',loginInfo.refreshToken,{
    //     httpOnly:true,
    //     secure:false
    // })

    setAuthCookies(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login succesfully",
        data: loginInfo,

    })
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "no refresh token recieved");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string) 


    // res.cookie('accessToken', tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
setAuthCookies(res, tokenInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "new access Token retrived  succesfully",
        data: tokenInfo,

    })
})
const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   
    res.clearCookie('accessToken',{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
   

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out succesfully",
        data: null,

    })
})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   
  const newPassword = req.body.newPassword;
  const oldPassWord = req.body.oldPassWord;
  const decodedToken = req.user 

   await AuthServices.resetPassword(oldPassWord,newPassword,decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "password changed succesfully",
        data: null,

    })
})
const googleCallBackControllers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    let state = req.query.state?req.query.state as string :'';
    if(state.startsWith('/')){
        state=state.slice(1)
    }
    const user = req.user;
    console.log("user",user);
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST,"user not found")
    }
    const tokenInfo =  createUserToken(user)

    setAuthCookies(res,tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${state}`)
    // state=redirectTo

})
export const AuthControllers = {
    credentialLogIn, getNewAccessToken,logOut,resetPassword,googleCallBackControllers
}