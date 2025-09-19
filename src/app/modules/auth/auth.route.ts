import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";
import passport from "passport";

const router = Router()

router.post('/login',AuthControllers.credentialLogIn)
router.post('/refresh-token',AuthControllers.getNewAccessToken)
router.post('/logout',AuthControllers.logOut)
router.post('/reset-password',checkAuth(...Object.values(Role)),AuthControllers.resetPassword)
router.get('/google',async(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope:["profile","email"]})(req,res,next)
})

router.get('/google/callback',passport.authenticate('google',{failureRedirect:"/login"}),AuthControllers.googleCallBackControllers)
export const AuthRoutes = router;