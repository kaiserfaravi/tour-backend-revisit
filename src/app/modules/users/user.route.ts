import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import z, { ZodObject } from "zod";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from "../../errorHelpers/appError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router()



router.post("/register",validateRequest(createUserZodSchema),userControllers.createUser)
router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),userControllers.getAllUsers)

export const userRoutes = router;