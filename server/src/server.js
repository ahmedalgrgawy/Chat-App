import express from 'express'
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/messages.routes.js'
import { connectDB } from './lib/db.js';

dotenv.config();

const port = process.env.PORT || 5001;

const app = express()

app.use(express.json())

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use('/api/auth', authRoutes)

app.use('/api/message', messageRoutes)

app.listen(port, () => {
    connectDB()
    console.log('Server is Live on ' + port)
})