import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { getUsers, getMessages, sendMessages } from '../controllers/messages.controllers.js';

const router = express.Router()

router.get("/users", protectedRoute, getUsers)

router.get("/:id", protectedRoute, getMessages)

router.post("/send/:id", protectedRoute, sendMessages)

export default router;