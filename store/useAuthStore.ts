import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    initAuth: () => Promise<void>; // Call this on app load
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    setAuth: async (token: string, user: User) => {
        try {
            await SecureStore.setItemAsync('access_token', token);
            await SecureStore.setItemAsync('user_data', JSON.stringify(user));
            set({ token, user, isAuthenticated: true });
        } catch (error) {
            console.error('Failed to set auth', error);
        }
    },

    logout: async () => {
        try {
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('user_data');
            set({ token: null, user: null, isAuthenticated: false });
        } catch (error) {
            console.error('Failed to logout', error);
        }
    },

    initAuth: async () => {
        try {
            const token = await SecureStore.getItemAsync('access_token');
            const userDataString = await SecureStore.getItemAsync('user_data');
            if (token && userDataString) {
                set({
                    token,
                    user: JSON.parse(userDataString),
                    isAuthenticated: true,
                });
            }
        } catch (error) {
            console.error('Failed to initialize auth', error);
        }
    },
}));
