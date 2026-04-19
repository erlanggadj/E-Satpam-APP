import { create } from 'zustand';

interface UserProfile {
    user_id: string;       // Sesuai dengan response API
    employee_id: string;   // Tambahan untuk nomor identitas
    name: string;
    role: string;
    avatar: string;        // Sesuaikan dengan API (sebelumnya avatarUrl)
    isOnline?: boolean;
}

interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    login: (user: UserProfile) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    login: (user) => set({ isAuthenticated: true, user }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));