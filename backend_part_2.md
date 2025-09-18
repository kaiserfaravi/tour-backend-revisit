# create refresh token and send it to client
 - setting secret and expires in .env
 - in auth service ` const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)` generate refresh token and send it to user without pass.
 - utils->userToken.ts 
 
 ```
 const getNewAccessToken =async(refreshToken:string)=>{
    
    const verifiedRefreshToken = verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload;
    const isUserExist = await User.findOne({email:verifiedRefreshToken.email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User doesnt exist")
    }

    if(isUserExist.isActive===IsActive.BLOCKED || isUserExist.isActive===IsActive.INACTIVE){
         throw new AppError(httpStatus.BAD_REQUEST,`User ${isUserExist.isActive}`)
    }
    if(isUserExist.isDeleted){
         throw new AppError(httpStatus.BAD_REQUEST,"User deleted")
    }


    const jwtPayload ={
        userId:isUserExist.id,
        email:isUserExist.email,
        role:isUserExist.role

    }

    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)
    // const accessToken = jwt.sign(jwtPayload,"secret",{
    //     expiresIn:"1d"
    // })

    const userTokens = createUserToken(isUserExist)

   const {password:pass,...rest}= isUserExist.toObject()

 return{
        accessToken
}
}


const getNewAccessToken =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)


     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User login succesfully",
        data:tokenInfo,
        
    })
})
```

# set the access token and refresh token in cookies

- login korar somoi j refresh token ta pai seta cookie te set korte hobe
```
 res.cookie('refreshToen',loginInfo.refreshToken,{
        httpOnly:true,
        secure:false
    })

```
- npm i cookie-parser and types
- token releted sob code ekta utility function e rekhe dilam

- cookie login korar somoi access token new refresh token set korar pore abar jokhon newly set korbe ,jeno purono ta theke na jai sejonnno get new access token e abar set kore dite hobe
  
  - utility->setCookie.ts

  # implement log out
  
  ```
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

  ```

 # implement password change/reset
  