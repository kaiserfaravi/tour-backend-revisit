import { Server } from "http"
import express from "express"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("connected to db");
        server = app.listen(envVars.PORT, () => {
            console.log(`listenining on ${5000}`);
        })
    } catch (error) {

    }
}

(async () => {
    await startServer()
    await seedSuperAdmin()
})()
process.on("unhandledRejection", (error) => {
    console.log('Unhandled rejection detected,server shutting down', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

process.on("uncaughtException", (error) => {
    console.log('uncought local rejection detected,server shutting down', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})


process.on("SIGTERM", () => {
    console.log('Sigterm signal recieved,server shutting down');

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

//forcefully shutdown
process.on("SIGINT", () => {
    console.log('sigint recieved,user forcefully server shutting down');

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})



