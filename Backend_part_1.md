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

 