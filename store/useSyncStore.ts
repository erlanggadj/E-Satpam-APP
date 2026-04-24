import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
    markItemAsSynced: (id: string) => void;
    syncServerData: (moduleId: string, serverData: any[]) => void;
    approveItem: (id: string, moduleId: string) => void;
    clearAll: () => void;
}

// Global placeholder state for our generic module flow
export const useSyncStore = create<SyncStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => ({
                    items: [item, ...state.items],
                })),
            syncItems: () =>
                set((state) => ({
                    items: state.items.map((item) => ({ ...item, sync_status: 1 })),
                })),
            markItemAsSynced: (id: string) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, sync_status: 1 } : item
                    ),
                })),
            syncServerData: (moduleId: string, serverData: any[]) =>
                set((state) => {
                    const existingIds = new Set(state.items.map(i => i.id));
                    const newItems = serverData
                        .filter(d => !existingIds.has(d.id))
                        .map(d => {
                            const { id, createdAt, updatedAt, ...rest } = d;
                            return {
                                id: id,
                                moduleId: moduleId,
                                data: rest,
                                sync_status: 1 as const, // Server data is already synced
                                created_at: createdAt || new Date().toISOString()
                            };
                        });
                    if (newItems.length === 0) return state; // no state change
                    return { items: [...newItems, ...state.items] };
                }),
            approveItem: (id: string, moduleId: string) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id && item.moduleId === moduleId
                            ? { ...item, data: { ...item.data, status: 'APPROVED' } }
                            : item
                    ),
                })),
            clearAll: () => set({ items: [] })
        }),
        {
            name: 'sync-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
