import User from '../models/user.model.js'
import redis from '../lib/redis.js'
import jwt from 'jsonwebtoken'
import { generateToken } from '../utils/generateToken.js'
import { storeTokenInCookies, storeTokenInRedis } from '../utils/storeToken.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    try {

        const { email, fullName, password } = req.body

        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const newUser = new User({ email, fullName, password })

        const { accessToken, refreshToken } = generateToken(newUser._id)

        await storeTokenInRedis(newUser._id, refreshToken)

        storeTokenInCookies(res, accessToken, refreshToken)

        newUser.save()

        return res.status(201).json({ message: "User created successfully", newUser })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        // authentication - Store Token in Redis & Cookies
        const { accessToken, refreshToken } = generateToken(user._id)

        await storeTokenInRedis(user._id, refreshToken)

        storeTokenInCookies(res, accessToken, refreshToken)

        return res.status(200).json({
            success: true, message: "Logged in successfully", user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profileImg: user.profilePic,
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            await redis.del(`refreshToken_${decodedToken.userId}`);
        }

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {

        const { profilePic, fullName } = req.body
        const userId = req.user._id

        if (!profilePic) return res.status(400).json({ success: false, message: "Profile picture is required" })

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url, fullName: fullName || req.user.fullName }, { new: true })

        return res.status(200).json({ success: true, message: "Profile updated successfully", updatedUser })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }

}

export const getProfile = async (req, res) => {
    try {
        return res.status(200).json({ success: true, user: req.user })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }

}