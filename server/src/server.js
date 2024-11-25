import express from 'express'
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// routes
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/messages.routes.js'
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const port = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use('/api/auth', authRoutes)

app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
    })
}

server.listen(port, () => {
    connectDB()
    console.log('Server is Live on ' + port)
})