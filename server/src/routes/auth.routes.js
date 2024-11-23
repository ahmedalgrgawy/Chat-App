import express from 'express'
import { getProfile, login, logout, signup, updateProfile } from '../controllers/auth.controllers.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/profile', protectedRoute, getProfile)

router.get('/signup', signup)

router.get('/login', login)

router.put('/update-profile', protectedRoute, updateProfile)

router.get('/logout', logout)

export default router;