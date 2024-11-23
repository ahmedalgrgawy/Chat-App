import express from 'express'
import { getProfile, login, logout, signup, updateProfile } from '../controllers/auth.controllers.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/profile', protectedRoute, getProfile)

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.put('/update-profile', protectedRoute, updateProfile)
export default router;