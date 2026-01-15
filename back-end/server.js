import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import connectionDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const allowedOrigin = '*';

app.use(
    cors({
        origin: allowedOrigin,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["content-type", "Authorization"]

    })
)

app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



// DB-Connect
connectionDB()



// Routes

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/task", taskRoutes)
app.use("/api/v1/auth", reportRoutes)










const PORT = process.env.PORT|| 5000

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);

})