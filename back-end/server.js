// import fs from "fs"
// import path from "path"
import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import connectionDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
dotenv.config()



const app = express()

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["content-type", "Authorization"]
    })
)



app.use(express.json())



// DB-Connect
connectionDB()



// Routes

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
// app.use("/api/v1/auth", reportRoutes)
// app.use("/api/v1/auth", taskRoutes)










const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);

})