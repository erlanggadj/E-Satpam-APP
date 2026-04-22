import { api } from '@/config/api';
import { useModuleStore } from '@/store/useModuleStore';
import { useSyncStore } from '@/store/useSyncStore';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

const syncBatch = async (moduleName: string, records: any[]) => {
    if (records.length === 0) return true;
    try {
        const response = await api.post('/sync/batch', {
            module: moduleName,
            records: records,
        });
        return response.status === 200 || response.status === 201;
    } catch (error) {
        console.error(`[Sync] Failed to sync batch for module: ${moduleName}`, error);
        return false;
    }
};

export const syncAllPendingData = async () => {
    console.log("[Sync] Starting background sync to backend...");

    // 1. Sync `useSyncStore` (Generic Modules: tamu, kejadian, piket)
    const syncState = useSyncStore.getState();
    const allPendingGeneric = syncState.items.filter(item => item.sync_status === 0);

    // Group generic items by moduleId
    const genericGroups: Record<string, any[]> = {};
    allPendingGeneric.forEach(item => {
        if (!genericGroups[item.moduleId]) genericGroups[item.moduleId] = [];
        // Flatten the data property for backend
        genericGroups[item.moduleId].push({ id: item.id, ...item.data });
    });

    for (const [moduleId, records] of Object.entries(genericGroups)) {
        console.log(`[Sync] Syncing ${records.length} records for module: ${moduleId}...`);
        const success = await syncBatch(moduleId, records);
        if (success) {
            records.forEach(r => syncState.markItemAsSynced(r.id));
            console.log(`[Sync] ✅ Success: ${moduleId}`);
        }
    }

    // 2. Sync `useModuleStore` (Core Modules: mutasi, afkir, etc)
    const moduleState = useModuleStore.getState();

    // Mapping from state key to backend module string identifier
    const storeToModuleMap: Record<string, string> = {
        'containers': 'container',
        'afkirs': 'afkir',
        'izins': 'izin',
        'keys': 'keylog',
        // Mutasi is complex master-detail, for PRD standard we send the whole object under 'mutasi'
        'mutations': 'mutasi'
    };

    let totalCoreSynced = 0;

    for (const [storeKey, moduleName] of Object.entries(storeToModuleMap)) {
        const pending = (moduleState[storeKey as keyof typeof moduleState] as any[])?.filter(item => item.sync_status === 0) || [];
        if (pending.length > 0) {

            // For mutasi, we need to attach members and activities
            let payloadRecords = pending;
            if (storeKey === 'mutations') {
                const members = moduleState.mutationMembers || [];
                const activities = moduleState.mutationActivities || [];
                payloadRecords = pending.map(m => ({
                    ...m,
                    members: members.filter(mem => mem.mutationId === m.id),
                    activities: activities.filter(act => act.mutationId === m.id)
                }));
            }

            console.log(`[Sync] Syncing ${payloadRecords.length} records for core module: ${moduleName}...`);
            const success = await syncBatch(moduleName, payloadRecords);
            if (success) {
                pending.forEach(r => moduleState.markAsSynced(storeKey as any, r.id));
                totalCoreSynced += pending.length;
                console.log(`[Sync] ✅ Success: ${moduleName}`);

                // Mark children as synced as well if mutasi
                if (storeKey === 'mutations') {
                    payloadRecords.forEach(m => {
                        m.members.forEach((mem: any) => moduleState.markAsSynced('mutationMembers', mem.id));
                        m.activities.forEach((act: any) => moduleState.markAsSynced('mutationActivities', act.id));
                    });
                }
            }
        }
    }

    if (allPendingGeneric.length === 0 && totalCoreSynced === 0) {
        console.log("[Sync] No pending data found. Sync complete.");
    } else {
        console.log(`[Sync] Finished syncing routine.`);
    }
};

export function useBackgroundSync() {
    useEffect(() => {
        // Listen to network state changes
        const unsubscribe = NetInfo.addEventListener(state => {
            // If connected to internet
            if (state.isConnected && state.isInternetReachable !== false) {
                console.log("[Network] Internet is available. Checking for pending sync...");
                syncAllPendingData();
            } else {
                console.log("[Network] Device went offline. Sync paused.");
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);
}
