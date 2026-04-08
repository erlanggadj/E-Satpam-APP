import { create } from 'zustand';

export interface SyncItem {
    id: string;
    moduleId: string;
    data: Record<string, any>;
    sync_status: 0 | 1; // 0 = Pending, 1 = Synced
    created_at: string;
}

interface SyncStore {
    items: SyncItem[];
    addItem: (item: SyncItem) => void;
    syncItems: () => void;
}

// Global placeholder state for our generic module flow
export const useSyncStore = create<SyncStore>((set) => ({
    items: [
        // Pre-seed some dummy data for "tamu" to demonstrate History View without being empty
        {
            id: 'dummy-1',
            moduleId: 'tamu',
            data: {
                nama_tamu: 'Bapak Joko',
                tujuan: 'Mengantar Paket',
                nomor_kendaraan: 'B 1234 ABC',
            },
            sync_status: 1, // Synced (Green tick)
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
            id: 'dummy-2',
            moduleId: 'tamu',
            data: {
                nama_tamu: 'Ibu Siti',
                tujuan: 'Meeting Direksi',
                nomor_kendaraan: 'D 5678 EFG',
            },
            sync_status: 0, // Pending (Yellow clock)
            created_at: new Date().toISOString(),
        }
    ],
    addItem: (item) =>
        set((state) => ({
            items: [item, ...state.items],
        })),
    syncItems: () =>
        set((state) => ({
            items: state.items.map((item) => ({ ...item, sync_status: 1 })),
        })),
}));
