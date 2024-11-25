import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/'

export const useAuthStore = create((set, get) => ({
    authUser: null,
    onlineUsers: [],
    isSignup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/profile")

            set({ authUser: response.data.user, isCheckingAuth: false })

            get().connectSocket();

        } catch (error) {
            console.log(error);

            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        try {
            set({ isSigningUp: true })

            const response = await axiosInstance.post("/auth/signup", {
                fullName: data.fullName,
                email: data.email,
                password: data.password
            })

            set({ authUser: response.data.newUser, isSigningUp: false })

            toast.success("Account created successfully")

            get().connectSocket();

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true })

            const response = await axiosInstance.post("/auth/login", {
                email: data.email,
                password: data.password
            })

            set({ authUser: response.data.user, isLoggingIn: false })

            toast.success("user logged in successfully")

            get().connectSocket();

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");

            set({ authUser: null });

            toast.success("Logged out successfully");

            get().disconnectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (profilePic) => {
        try {
            set({ isUpdatingProfile: true })

            const response = await axiosInstance.put("/auth/update-profile", { profilePic })

            set({ authUser: response.data.updatedUser, isUpdatingProfile: false })

            toast.success("Profile updated successfully")

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        if (!authUser || get().socket?.connected) return;

        const socket = io(baseURL, {
            query: {
                userId: authUser._id
            }
        });

        socket.connect();

        set({ socket: socket })

        socket.on("onlineUsers", (users) => {
            set({ onlineUsers: users })
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}));
