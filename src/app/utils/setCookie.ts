import { Response } from "express";

export interface tokens{
    accessToken?:string,
    refreshToken?:string,
}

export const setAuthCookies =(res:Response,tokenInfo:tokens)=>{
    if(tokenInfo.accessToken){
         res.cookie('accessToken',tokenInfo.accessToken,{
        httpOnly:true,
        secure:false
    })
    }
    if(tokenInfo.refreshToken){
         res.cookie('refreshToken',tokenInfo.refreshToken,{
        httpOnly:true,
        secure:false
    })
    }
}