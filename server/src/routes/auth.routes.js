import express from 'express'
import { getProfile, login, logout, signup, } from '../controllers/auth.controllers.js'

const router = express.Router()

router.get('/profile', getProfile)

router.get('/signup', signup)

router.get('/login', login)

router.get('/logout', logout)

export default router;