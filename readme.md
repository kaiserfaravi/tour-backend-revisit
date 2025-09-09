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

- in packange.json file-> script -> add "dev":"ts-node-dev --respawn --transpile-only .src/server.ts",

# modular mvc pattern

- for each features there will be a folder and there will be all files for this features
  like:interface,controller,models etc

- app folder->modules folder-> features folder

# settings server and app

```javascript
import { Server } from "http";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

// const app = express()

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mongoDB:mongoDB@cluster0.nbhtrh3.mongodb.net/Tour-Revisit?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("connected to DB");

    server = app.listen(5000, () => {
      console.log(`listenining on ${5000}`);
    });
  } catch (error) {
    console.log("server e error pawa gese");
  }
};
startServer();

// app.get("/",(req:Request,res:Response)=>{
//     res.status(200).json({
// message:"welcome to revisit of my tour backend"
//     })
// })
```

# app settings

- make express app in app.ts and export default

```javascript
import express, { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to revisit of my tour backend",
  });
});

export default app;
```

# Error Handlers for Servers,Unhandled rejection,Uncought Exception

## unhandled rejection

-jodi kono promise try catch e handle korte vule jai,amader server gracefully shutdown korbe

```javascript
process.on("unhandledRejection", () => {
  console.log("Unahandled rejection detected...server shutting Down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
```

## uncought exception error
localy kono error asle catch korbe like variable
 ```javascript
 process.on("uncaughtException",(error)=>{
    console.log('uncought local rejection detected,server shutting down',error);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})
```
## sigterm ,error from deployment/cloud
- anny error signal from cloud
 ```javascript
 process.on("SIGTERM",()=>{
    console.log('Sigterm signal recieved,server shutting down');

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})
```
## forcefully self shutdown
```javascript
process.on("SIGINT",()=>{
    console.log('sigint recieved,server shutting down');

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1);
})
```

# setting up eslint
- npm install --save-dev eslint @eslint/js typescript typescript-eslint
- create on root eslint.config.mjs
- check the next steps on website
- in package.json in scripts "lint":"npx eslint ./src"
```javascript
// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
   tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules:{
        "no-console":"warn"
    }
  }
);
```
# settings env 
- in root .env
- app folder->config folder->env.ts
- insert .env in gitignore




```javascript

import dotenv from "dotenv";

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production"
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production"
    }
}

export const envVars = loadEnvVariables()
```
## explanation

বাহ! তুমি দারুণ সুন্দরভাবে `.env` লোড করার জন্য একটা টাইপ-সেফ utility লিখেছো 👌
এবার আমি তোমার পুরো কোডটা **লাইন বাই লাইন** বাংলায় বুঝিয়ে দিচ্ছি।

---

```ts
import dotenv from "dotenv";
```

👉 এখানে তুমি `dotenv` লাইব্রেরি ইমপোর্ট করছো।
এটার কাজ হলো `.env` ফাইলের ভেতরের key=value জোড়াগুলোকে পড়া এবং `process.env` এর মধ্যে সেট করা।

---

```ts
dotenv.config()
```

👉 এই লাইন দিয়ে তুমি `.env` ফাইল লোড করছো।

* `.env` ফাইলে ধরো আছে:

  ```
  PORT=5000
  DB_URL=mongodb://localhost:27017/test
  NODE_ENV=development
  ```
* এখন এগুলো `process.env` এর মধ্যে ঢুকে যাবে।

---

```ts
interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production"
}
```

👉 এখানে তুমি TypeScript এর একটা **interface** বানিয়েছো, নাম `EnvConfig`।
এটা বলে দিচ্ছে তোমার `loadEnvVariables()` ফাংশন থেকে যা return করবে, তার টাইপ কেমন হবে।

* `PORT` → string
* `DB_URL` → string
* `NODE_ENV` → শুধু `"development"` বা `"production"` হতে পারবে (অন্য কিছু হলে error ধরবে TypeScript)।

---

```ts
const loadEnvVariables = (): EnvConfig => {
```

👉 এখানে তুমি একটা ফাংশন ডিফাইন করছো, নাম `loadEnvVariables`।
এটা return করবে একটা object, যার টাইপ `EnvConfig`।

---

```ts
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"];
```

👉 এখানে তুমি একটা array বানালে, যেখানে সেইসব environment variables এর নাম লিখে রাখলে যেগুলো **অবশ্যই থাকা লাগবে**।
মানে তোমার অ্যাপ এই তিনটার ওপর নির্ভর করে।

---

```ts
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })
```

👉 এই লুপে তুমি প্রতিটি key চেক করছো।

* যদি `process.env` এ ওই key না থাকে, তাহলে সরাসরি error throw করবে।
* যেমন `.env` ফাইলে যদি `DB_URL` না থাকে → সাথে সাথে error হবে:

  ```
  Missing require environment variabl DB_URL
  ```

---

```ts
    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production"
    }
```

👉 সবগুলো environment variable ঠিক আছে নিশ্চিত হওয়ার পর তুমি সেগুলো return করছো।

* `PORT: process.env.PORT as string` → এখানে TypeScript কে জোর করে বলছো, `PORT` অবশ্যই string হবে।
* `DB_URL: process.env.DB_URL!` → এখানে **non-null assertion** `!` ব্যবহার করেছো, মানে "আমি নিশ্চিত এখানে null বা undefined হবে না"।
* `NODE_ENV: process.env.NODE_ENV as "development" | "production"` → এখানে TypeScript কে বলছো `NODE_ENV` এর মান কেবল `"development"` বা `"production"` হতে পারবে।

---

```ts
}
```

👉 ফাংশন `loadEnvVariables` এর শেষ।

---

```ts
export const envVars = loadEnvVariables()
```

👉 এখানে তুমি ফাংশনটা কল করছো, এবং return করা object কে `envVars` নামে export করছো।
মানে এখন project এর যেকোনো জায়গায় তুমি লিখতে পারবে:

```ts
import { envVars } from "./path/to/env";

console.log(envVars.PORT);
console.log(envVars.DB_URL);
console.log(envVars.NODE_ENV);
```

---

## ✅ সারসংক্ষেপ:

import dotenv from "dotenv";
👉 এখানে তুমি dotenv লাইব্রেরি ইমপোর্ট করছো।
এটার কাজ হলো .env ফাইলের ভেতরের key=value জোড়াগুলোকে পড়া এবং process.env এর মধ্যে সেট করা।

ts
Copy code
dotenv.config()
👉 এই লাইন দিয়ে তুমি .env ফাইল লোড করছো।

.env ফাইলে ধরো আছে:

ini
Copy code
PORT=5000
DB_URL=mongodb://localhost:27017/test
NODE_ENV=development
এখন এগুলো process.env এর মধ্যে ঢুকে যাবে।

ts
Copy code
interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production"
}
👉 এখানে তুমি TypeScript এর একটা interface বানিয়েছো, নাম EnvConfig।
এটা বলে দিচ্ছে তোমার loadEnvVariables() ফাংশন থেকে যা return করবে, তার টাইপ কেমন হবে।

PORT → string

DB_URL → string

NODE_ENV → শুধু "development" বা "production" হতে পারবে (অন্য কিছু হলে error ধরবে TypeScript)।

ts
Copy code
const loadEnvVariables = (): EnvConfig => {
👉 এখানে তুমি একটা ফাংশন ডিফাইন করছো, নাম loadEnvVariables।
এটা return করবে একটা object, যার টাইপ EnvConfig।

ts
Copy code
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"];
👉 এখানে তুমি একটা array বানালে, যেখানে সেইসব environment variables এর নাম লিখে রাখলে যেগুলো অবশ্যই থাকা লাগবে।
মানে তোমার অ্যাপ এই তিনটার ওপর নির্ভর করে।

ts
Copy code
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })
👉 এই লুপে তুমি প্রতিটি key চেক করছো।

যদি process.env এ ওই key না থাকে, তাহলে সরাসরি error throw করবে।

যেমন .env ফাইলে যদি DB_URL না থাকে → সাথে সাথে error হবে:

javascript

`Missing require environment variabl DB_URL`
```ts
Copy code
    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production"
    }
👉 সবগুলো environment variable ঠিক আছে নিশ্চিত হওয়ার পর তুমি সেগুলো return করছো।
```
PORT: process.env.PORT as string → এখানে TypeScript কে জোর করে বলছো, PORT অবশ্যই string হবে।

DB_URL: process.env.DB_URL! → এখানে non-null assertion ! ব্যবহার করেছো, মানে "আমি নিশ্চিত এখানে null বা undefined হবে না"।

NODE_ENV: process.env.NODE_ENV as "development" | "production" → এখানে TypeScript কে বলছো NODE_ENV এর মান কেবল "development" বা "production" হতে পারবে।

ts

}
👉 ফাংশন loadEnvVariables এর শেষ।


`export const envVars = loadEnvVariables()`
👉 এখানে তুমি ফাংশনটা কল করছো, এবং return করা object কে envVars নামে export করছো।
মানে এখন project এর যেকোনো জায়গায় তুমি লিখতে পারবে:

```ts

import { envVars } from "./path/to/env";

console.log(envVars.PORT);
console.log(envVars.DB_URL);
console.log(envVars.NODE_ENV);
```
✅ সারসংক্ষেপ:
.env ফাইল থেকে config লোড করছো।

Interface দিয়ে টাইপ-সেফ object বানাচ্ছো।

সব required env variable আছে কিনা check করছো।

Safe ভাবে PORT, DB_URL, NODE_ENV return করছো।

Export করে project এ ব্যবহার করতে দিচ্ছো।


