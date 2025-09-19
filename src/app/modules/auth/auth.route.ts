import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user.interface";

const router = Router()

router.post('/login',AuthControllers.credentialLogIn)
router.post('/refresh-token',AuthControllers.getNewAccessToken)
router.post('/logout',AuthControllers.logOut)
router.post('/reset-password',checkAuth(...Object.values(Role)),AuthControllers.resetPassword)

export const AuthRoutes = router;