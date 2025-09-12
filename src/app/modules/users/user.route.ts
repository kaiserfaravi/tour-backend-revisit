import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import z, { ZodObject } from "zod";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router()


router.post("/register",validateRequest(createUserZodSchema),userControllers.createUser)
router.get("/all-users",userControllers.getAllUsers)

export const userRoutes = router;