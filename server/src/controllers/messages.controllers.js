import cloudinary from "../lib/cloudinary"
import Message from "../models/message.model"
import User from "../models/user.model"

export const getUsers = async (req, res) => {
    try {
        const userId = req.user._id

        const users = await User.find({
            _id: {
                $ne: userId
            }
        }).select('-password')

        return res.status(200).json({ success: true, users })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const getMessages = async () => {
    try {

        const currentUserId = req.user._id

        const { id: otherUserId } = req.params

        const messages = await Message.find({
            $or: [
                {
                    senderId: currentUserId,
                    receiverId: otherUserId
                },
                {
                    senderId: otherUserId,
                    receiverId: currentUserId
                }
            ]
        })

        return res.status(200).json({ success: true, messages })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params
        const { text, img } = req.body;
        const senderId = req.user._id

        let imgUrl;
        if (img) {
            const uploadResponse = await cloudinary.uploader.upload(img)
            imgUrl = uploadResponse.secure_url
        }

        const newMessage = Message.create({
            senderId,
            receiverId,
            text,
            image: imgUrl
        })

        await newMessage.save()

        // realTime 

        return res.status(201).json({ success: true, message: "Message sent successfully", newMessage })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}