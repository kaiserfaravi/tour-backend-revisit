import {Server} from 'http'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose';
import app from './app';

let server:Server;

// const app = express()

const startServer = async()=>{

    try {
        await mongoose.connect("mongodb+srv://mongoDB:mongoDB@cluster0.nbhtrh3.mongodb.net/Tour-Revisit?retryWrites=true&w=majority&appName=Cluster0")
        console.log("connected to DB");

        server = app.listen(5000,()=>{
            console.log(`listenining on ${5000}`);
        })

    } catch (error) {
        console.log("server e error pawa gese");
    }
}
startServer()

// app.get("/",(req:Request,res:Response)=>{
//     res.status(200).json({
// message:"welcome to revisit of my tour backend"
//     })
// })