import passport from "passport";
import { envVars } from "./env";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { User } from "../modules/users/user.model";
import { Role } from "../modules/users/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs"


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email: string, password: string, done) => {
        try {

            const isUserExist = await User.findOne({ email })

            if (!isUserExist) {
             return done("user doesnt exist")
            }
            // if (!isUserExist) {
            //  return done(null,false,{message:"user doesnt exist"})
            // }
            const matchedpassword = await bcryptjs.compare(password as string, isUserExist.password as string)


            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects=>providerObjects.provider=="google")
            if(isGoogleAuthenticated){
                return done(null,false,{message:"password set koren,apni google diye signing kora"})
            }


            if (!matchedpassword && !isUserExist.password) {
               return done(null,false,{message:"password doesnt matched"})
            }
            return done(null,isUserExist)

        } catch (error) {
            console.log(error);
            done(error)
        }
    })
)

passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

        try {
            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "No Email Found" })
            }
            let user = await User.findOne({ email })
            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })

            }
            return done(null, user)

        } catch (error) {
            console.log("google error", error);
            return done(error)
        }
    })
)

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {

    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error, "deserialize error");
        done(error)
    }
})