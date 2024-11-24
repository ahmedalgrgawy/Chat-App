import { create } from 'zustand';
import { axiosInstance } from './lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/profile")

            set({ authUser: response.data.user, isCheckingAuth: false })

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

            toast.success("user logged in successfully")

            set({ authUser: response.data.user, isLoggingIn: false })

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
            // get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

}));
