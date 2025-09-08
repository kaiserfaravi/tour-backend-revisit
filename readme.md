# initialization

- git init

- .gitignore file create and node_modules insert

- npm init -y

- npm i -D typescript

- tsc --init and root and outDirectory settings

- npm i express mongoose zod jsonwebtoken cors dotenv

- npm i -D ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken

- create src and dist folder in root

- src folder->create server.ts->app.ts file & app folder

- in packange.json file-> script -> add  "dev":"ts-node-dev --respawn --transpile-only .src/server.ts",

# modular mvc pattern

- for each features there will be a folder and there will be all files for this features 
like:interface,controller,models etc

- app folder->modules folder-> features folder


# settings server and app

```javascript

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
```