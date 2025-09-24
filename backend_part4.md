# configure passport js for custom authentication

- service er modde j bussiness logic gula kortesi segula passportjs diye korbo.
- passport.ts e ekhon configure korbo
- user and password match korbo
- google authenticated kina check korbo

```
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email: string, password: string, done) => {
        try {

            const isUserExist = await User.findOne({ email })

            if (!isUserExist) {
             return done(null,false,{message:"user doesnt exist"})
            }
            const matchedpassword = await bcryptjs.compare(password as string, isUserExist.password as string)


            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects=>providerObjects.provider=="google")
            if(isGoogleAuthenticated){
                return done(null,false,{message:"password set koren,apni google diye signing kora"})
            }


            if (!matchedpassword) {
               return done(null,false,{message:"password doesnt matched"})
            }
            return done(null,isUserExist)

        } catch (error) {
            console.log(error);
            done(error)
        }
    })
)

```

```
passport.authenticate("local", async (err: any, user: any, info: any) => {

     if(err){
         return new AppError(401,err)
     }
     if(!user){
         return new AppError(401,info.message)
     }

     const userTokens = await createUserToken(user)

     const {password:pass,...rest}= user.toOject()

     setAuthCookies(res, userTokens)

     sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: "User login succesfully",
         data: {
             accessToken:userTokens.accessToken,
             refreshToken:userTokens.refreshToken,
             user:rest
         },

     })
 })(req, res, next)


```



# handling mongoose cast error
- err.code = 1100 mane mongoose e duplicate error

  ``` let errorSources:any = [{}]

    let statusCode = 500
    let message = "something went wrong"
    // duplicate error
    if (err.code == 1000) {
        const matchedArray = err.message.matche(/"([^"]*)"/)
        statusCode = 500;
        message = `${matchedArray[1]} already exists`
    }
    // CastError
    else if(err.name=="CastError"){
        statusCode = 400
        message = "Invalid object id"
    }
    else if(err.name=="ValidationError"){
        statusCode =500
        const errors = Object.values(err.errors)
        // const errorSources:any = [{}]
        errors.forEach((errorObject:any)=>errorSources.push({
            path:errorObject.path,
            message:errorObject.message
        }))
        message= err.message
    }
  ```
  # handling zod error
  - 