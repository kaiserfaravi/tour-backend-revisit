import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router()

router.post('/login',AuthControllers.credentialLogIn)

export const AuthRoutes = router;