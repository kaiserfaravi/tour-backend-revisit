import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router()

router.post('/login',AuthControllers.credentialLogIn)
router.post('/refresh-token',AuthControllers.getNewAccessToken)
router.post('/logout',AuthControllers.logOut)

export const AuthRoutes = router;