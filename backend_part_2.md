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

- chech codes

# passport js/third party authentication

- google cloud->console->api & services ->
- ENV TE setup

# configure passport

- npm install passport-local passport-google-oauth20 an types
- in app.ts initialize,and use session
- ```
   app.use(passport.initialize())
  app.use(passport.session())
  ```

- npm i express-session
```
app.use(expressSession({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))
```



- config->passsport.ts file
```
import passport from "passport";
import { envVars } from "./env";
import { Strategy as GoogleStrategy, Profile, VerifyCallback} from "passport-google-oauth20";
import { User } from "../modules/users/user.model";
import { Role } from "../modules/users/user.interface";

passport.use(
    new GoogleStrategy({
        clientID:envVars.GOOGLE_CLIENT_ID,
        clientSecret:envVars.GOOGLE_CLIENT_SECRET,
        callbackURL:envVars.GOOGLE_CALLBACK_URL
    },async(accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback)=>{

         try {
            const email = profile.emails?.[0].value;

            if(!email){
                return done(null,false,{message:"No Email Found"})
            }
            let user = await User.findOne({email})
            if(!user){
                user = await User.create({
                    email,
                    name:profile.displayName,
                    picture:profile.photos?.[0].value,
                    role:Role.USER,
                    isVerified:true,
                    auths:[
                        {
                            provider:"google",
                            providerId:profile.id
                        }
                    ]
                })

            }
            return done(null,user)

         } catch (error) {
            console.log("google error",error);
            return done(error)
         }
    })
)


```
- google authentication by passport done
- now create the api
- get route banacchi karon google er maddome authentication ta korchi,body te kichu dicchina
- then ekta callback fnction hobe
```
router.get('/google',async(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope:["profile","email"]})(req,res,next)
})
```
- jokhon google login hobe ekta callback url e pathiye dibe `router.get('/google/callback',AuthControllers.googleCallBackControllers)`

```
const googleCallBackControllers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = req.user;
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST,"user not found")
    }
    const tokenInfo =  createUserToken(user)

    setAuthCookies(res,tokenInfo)

    res.redirect(envVars.FRONTEND_URL)

})
```
- serialize and deserialize the passport.ts
- passort.ts configure korechi but express.ja kichui jane na,so configure file ta sekhane import kora lagbe
- import './app/config/passport' in app.ts
- and router e `router.get('/google/callback',passport.authenticate('google',{failureRedirect:"/login"}),AuthControllers.googleCallBackControllers)`

# 