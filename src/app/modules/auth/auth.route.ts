import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router()

router.post('/login',AuthControllers.credentialLogIn)
router.post('/refresh-roken',AuthControllers.getNewAccessToken)

export const AuthRoutes = router;