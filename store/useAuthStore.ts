import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { useModuleStore } from './useModuleStore';
import { useSyncStore } from './useSyncStore';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    jabatan?: string;
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
            // Check for pending data
            const moduleState = useModuleStore.getState();
            const syncState = useSyncStore.getState();
            let hasPending = syncState.items.some((i: any) => i.sync_status === 0);

            ['containers', 'afkirs', 'izins', 'keys', 'mutations', 'mutationMembers', 'mutationActivities'].forEach(key => {
                const data = (moduleState as any)[key];
                if (!data) return;

                const items = Array.isArray(data) ? data : Object.values(data).flat();
                if ((items as any[]).some((i: any) => i.sync_status === 0)) hasPending = true;
            });

            if (hasPending) {
                const { syncAllPendingData } = await import('../hooks/useBackgroundSync');
                await syncAllPendingData();
            }

            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('user_data');

            // Clear local offline stores
            useModuleStore.getState().clearAll();
            useSyncStore.getState().clearAll();

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
