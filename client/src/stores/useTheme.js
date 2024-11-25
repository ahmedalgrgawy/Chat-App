import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("theme") || 'dracula',

    toggleTheme: (theme) => {
        localStorage.setItem("theme", theme)
        set({ theme })
    }

}))