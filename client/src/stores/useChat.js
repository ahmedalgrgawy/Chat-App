import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getAllUsers: async () => {
        try {
            set({ isUsersLoading: true })

            const res = await axiosInstance.get("/message/users")

            set({ users: res.data.users, isUsersLoading: false })

        } catch (error) {
            console.log(error);
            set({ isUsersLoading: false })
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true })

            const res = await axiosInstance.get(`/message/${userId}`)

            set({ messages: res.data.messages, isMessagesLoading: false })

        } catch (error) {
            console.log(error);
            set({ isMessagesLoading: false })
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        try {
            const { selectedUser, messages } = get();

            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)

            set({ messages: [...messages, res.data.newMessage], isMessagesLoading: false })

            toast.success("Message sent successfully")

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            set({ isMessagesLoading: false })
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    // optimize
    setSelectedUser: (user) => set({ selectedUser: user })
}))