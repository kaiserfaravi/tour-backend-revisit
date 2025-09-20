import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/routes'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler'
import httpStatus from 'http-status-codes'

import { notFound } from './app/middlewares/notFound'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import expressSession from 'express-session'
import './app/config/passport'



const app = express()

app.use(expressSession({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors())


app.use('/api/v1',router)

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
message:"welcome to revisit of my tour backend"
    })
})


app.use(globalErrorHandler)

app.use(notFound)

export default app
