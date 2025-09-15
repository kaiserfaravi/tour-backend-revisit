import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from 'jsonwebtoken'

export const generateAccessToken=(payload:JwtPayload,secret:string,expiresIn:string)=>{


    const accessToken = jwt.sign(payload,secret,{
        expiresIn
    } as SignOptions)

    return accessToken

}


export const verifyToken =(accessToken:string,secret:string)=>{
const verifiedToken = jwt.verify(accessToken,secret)
return verifiedToken
}