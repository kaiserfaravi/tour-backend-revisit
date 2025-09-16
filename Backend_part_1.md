## backend part 1

- npm i http-status-codes

- app folder -> routes folder->index.ts file for dynamic routing

- server.ts → app.ts → index.ts (routes) → user.route.ts → user.controller.ts → user.model.ts

- ### spliting controller and service layer
- user service file e ekta function banabo
- parameter hisebe controller theke asa data gula payload e pabo
- function ta database er sathe communicate korbe
- controller e service function ta call korbo and parameter hisebe data gula call korar somoi pathabo

```javacript

     const user = await userService.createUser(req.body)
      // calling the service function
```

```javascript
//service function
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
  });
  return user;
};

export const userService = {
  createUser,
};
```

# global error handler 
- app.ts e error handler function ta likhbo

- function ta 4 ta parameter nei,and jekhane ei error catch ta korte chaibo just next(error) call dilei hobe

```
app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    res.status(500).json({
        success:false,
        message:"error from error handler  ",
        err,
        stack:envVars.NODE_ENV === "development"?err.stack:null

    })
})
```
- 👉 এই middleware শুধু তখনই run হয় যখন:

 - কোনো controller বা middleware থেকে next(error) call করা হয়

- অথবা কোনো async কোড থেকে unhandled error throw হয় (যদি সেটা catch করা হয় এবং next(err) তে পাঠানো হয়)
- এখানে next(error) বলার মানে হলো:
"Express! আমার হাতে একটা error আছে। আমি এটাকে handle করছি না। তুমি তোমার error-handling middleware এ পাঠিয়ে দাও।"
- errorhandler code ta k app folder->middleWares folders->globalError.ts file e ekta function e niye jabo and app.ts e app.use() er modde call dibo

# custom app error
- app folder->errorHelpers folder->appError.ts

```
class AppError extends Error {
    public statusCode: number   // extra property যোগ করা হলো

    constructor(statusCode: number, message: string, stack = "") {
        super(message)  // parent Error class এ message পাঠানো হলো
        this.statusCode = statusCode; // custom property সেট করা হলো

        if (stack) {
            this.stack = stack   // যদি stack manually পাঠানো হয় তাহলে সেট করে দাও
        } else {
            Error.captureStackTrace(this, this.constructor)
            // নাহলে Error class থেকে current stack trace capture করে নাও
        }
    }
}

export default AppError
```

# Not found route
- app.ts e ekdom sob kichur last e

- middleware folder->notfound file
- export korbo and app.ts e impoort korbo
```
(req:Request,res:Response)=>{
    res.status(httpStatus.NOT_FOUND).json({
        success:false,
        message:"Route Not found "
    })
}
```

# avoid reptition of try catch ,use cacthAsync

```
type asyncHandler = (req:Request,res:Response,next:NextFunction)=>Promise<void>

const catchAsync =(fn:asyncHandler)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(fn(req,res,next)).catch((err:any)=>{
        next(err )
    })
}

const createUser =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const user = await userService.createUser(req.body)
     res.status(httpStatus.CREATED).json({
            message:"User Created",
            user
        })

})
```

# Send Response Utility Function
 - utils folder -> sendResponse.ts
 ```
 import { Response } from "express";

interface Tmeta{
    total:number
}


interface TResponse<T>{
     statusCode:number;
    success:boolean;
    message:string;
    data:T;
    meta?:Tmeta

}



export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}
```

# Module 27
# Zod Validation
- create and update er somoi zod validation korbe
- amader j req.body ta ache seta validation and sanitization kore controller e pathiye dibo
- ekta zod schema banabo ,and zod schema diye req.body k validate korbo
- schema ta User folder->user.validation.ts e niye jabo code organizing er jonno and export kore dibo
- ekhon amra ekta validate korar jonno higher order function banabo,jeta return korbe 
```
async (req:Request,res:Response,next:NextFunction)=>
    
    {
        req.body = await createUserZodSchema.parseAsync(req.body)
    }
```
- higher Order function ta parameter hisebe zod Object nei
- ebar register er modde middleware function tar jaigai function ta bosabo and schema ta k call dibo
` router.post("/register",validateRequest(createUserZodSchema),userControllers.createUser) `

```
const validateRequest=(zodSchema:ZodObject)=>async (req:Request,res:Response,next:NextFunction)=>
    
    {
        try {
            req.body = await zodSchema.parseAsync(req.body)
            next()
        } catch (error) {
         next(error)   
        }
    }
```

- ebar HOF ta k middlWare folder->validateRequest.ts -> e insert korbo export kore router e import korbo

# hash password
- install bcryptjs and hashpassword
`const hashedPassword = await bcryptjs.hash(password as string,10)`

# create login API
- modules folder->auth folder->auth.route,controller and services file
```
const credentialLogIn =async(payload:Partial<IUser>)=>{

    const {email,password}= payload;
    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User not found")
    }
    const matchedpassword = await bcryptjs.compare(password as string,isUserExist.password as string)

    if(!matchedpassword){
        throw new AppError(httpStatus.BAD_REQUEST,"password not matched")
    }

    return{
        email:isUserExist.email
    }
}
```
-  service file e payload theke email password nibo,userExist kore kina email diye db theke find korbo.pawa na gele error asbe,pele password match korbo bcrypt diye,then password bade baki data return kore dibo

- `  const loginInfo = await AuthServices.credentialLogIn(req.body)`
- authcontrollers e authService k call kore body ta pathay dibo
- response e data hisebe loginInfo ta dibo

# JWT 
- user login->got a token [identitiy]->for using fetures ,will show the token->
- npm i jsonwebtoken
- npm i -D @types/jsonwebtoken
- authservice e email and password jodi match kore amra user k ekta accessToken dite pari

```
  const jwtPayload ={
        userId:isUserExist.id,
        email:isUserExist.email,
        role:isUserExist.role

    }

    const accessToken = jwt.sign(jwtPayload,"secret",{
        expiresIn:"1d"
    })
 ```
-  jwt.sign 3ta parameter nei. then auth service e accesstoken ta return kore dibo

# verify token and protect route using middleware
 - amra all users route ta chai admin and super admin role chara onno kew use korte na paruk.
 - sejonno ekta middleware use korte hobe,req,res function lagbe,token ta lagbe
 - `const accessToken = req.headers.authorization` accesstoken ta amra evabe pabo
 - postman-(get allusers route api)->headers->key[authorization]= value[token]
 - ` const verifiedToken = jwt.verify(accessToken,"secret")` veriify the token.duita value nibe,accesstoken and secret ta jeta signature e use korsi


```
  try {
      const accessToken = req.headers.authorization 

      if(!accessToken){
        throw new AppError(400,'No token')
      }

    const verifiedToken = jwt.verify(accessToken,"secret") as JwtPayload

     console.log(verifiedToken);

    if(!verifiedToken){
        throw new AppError(400,"age verify koren")
    }

    if(verifiedToken.role!== Role.ADMIN || Role.SUPER_ADMIN){
        throw new AppError(400,"Youre not verified")

    }
   
    next()
  } catch (error) {
   next(error) 
  }
```
- get all users e header theke request kore authorization theke token nibo.token asche na asche verify korbo,then token verify korbo,jwt import kore,2 taparameter lagbe,()
- and route ta protected hobe admin and super admin chara kew access kortee parbena .
- accesstoken er role er sathe interface er role compare korbo,

# Create jwt helpers and check auth middleware
- acces token generate kora ta means jwt signature ta auth service theke jwt name e utility file e niye jabo and export korbo
- ```
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
}```
- auth service e j signature seta and user route e j router e verified kora hobe setar jonno soho function jwt file e likhbe
- utils->jwt
- user route er validation function ta ebar split korte hobe
- sejonno ekta HOF lagbe
- checkauth name e fucntion korlam
- ei function ta direct return kore route protect korar jonno j function ta create korlam se function ta
- checkAuth er modde Roles gula call kore dibo and HOF e rest operator diye nibo

# checkAuth middleWare and seed superAdmin
 - middleware folder->checkauth.ts ->replace the checkauth funciton and exports->import in user route ,what we are protecting
 
 ## SEEDING SUPER ADMIN
  - create email,password in env
  - utils->seeduperAdmin.ts
```
import { email } from "zod"
import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/users/user.interface"
import { User } from "../modules/users/user.model"
import bcryptjs from 'bcryptjs'

export const seedSuperAdmin =async()=>{

    try {

        const isSuperAdminExist = await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
            console.log("super Admin exist");
            return
        }

        const autProviders:IAuthProvider={
            provider:"credentials",
            providerId:envVars.SUPER_ADMIN_EMAIL
        }

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND))
        const payload:IUser = {
            name:"super admin",
            role:Role.SUPER_ADMIN,
            email:envVars.SUPER_ADMIN_EMAIL,
            password:hashedPassword,
            isVerified:true,
            auths:[autProviders]
        }
        const superAdmin = await User.create(payload)
        console.log("super admin created succesfully");
    } catch (error) {
        console.log(error);
    }
}

call in server in iife
(async () => {
    await startServer()
    await seedSuperAdmin()
})()

```
  # update user
  ```const updateUser =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.params.userId;
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload
    const payload = req.body;
    const user = await userService.updateUser(userId,payload,verifiedToken)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User updated Successfully",
        data:user,
        
    })

}) 

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId)

    if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND,"user Not found");
    }

    if (payload.role) {
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN,"You Are not authorized")
        }
    }

    if(payload.role===Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
        throw new AppError(httpStatus.FORBIDDEN,"You can't promote yourseld")
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
         if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN,"You Are not authorized")
        }
    }

    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password,Number(envVars.BCRYPT_SALT_ROUND))
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true})

    return newUpdatedUser;
}

  ``` 
  - 
# add custom property
 ```
 import { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express{
interface Request{
    user:JwtPayload
}
    }
}
```
