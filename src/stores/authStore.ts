import { create } from 'zustand';

interface AuthState {
    rememberMe: boolean;
    setRememberMe: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    rememberMe: false,
    setRememberMe: (value) => set({ rememberMe: value }),
}));
