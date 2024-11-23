import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${res.connection.name}`);
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};