import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import { userService } from "./user.service";
import { promise } from "zod";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const createUser =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const user = await userService.createUser(req.body)
    //  res.status(httpStatus.CREATED).json({
    //         message:"User Created",
    //         user
    //     })
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User Created Successfully",
        data:user,
        
    })

})

// const createUser=async(req:Request,res:Response,next:NextFunction)=>{

//     try {
    

//        const user = await userService.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message:"User Created",
//             user
//         })
//     } catch (error) {
//         console.log(error);
//         // res.status(httpStatus.BAD_REQUEST).json({
//         //     message:"something went wrong,from controller",
//         //     error
//         // })
//         next(error)
//     }
// }

const getAllUsers = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await userService.getAllUser()

      sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User Created Successfully",
        data:result.data,
        meta:result.meta

        
    })
})

export const userControllers ={
    createUser,getAllUsers
}