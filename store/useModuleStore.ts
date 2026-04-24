import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// --- Data Types ---
export type ContainerStatus = 'IN' | 'OUT' | 'APPROVED';
export type KeyStatus = 'DEPOSITED' | 'TAKEN' | 'APPROVED';

export type IzinStatus = 'OUT' | 'RETURNED' | 'APPROVED';

export interface IzinRecord {
    id: string;
    name: string;
    department: string;
    reasonType: 'Kerja' | 'Pribadi';
    destination: string;
    note: string;
    timeOut: string;
    timeIn?: string;
    status: IzinStatus;
    sync_status: 0 | 1;
}

export type AfkirStatus = 'IN' | 'OUT' | 'APPROVED';

export interface AfkirRecord {
    id: string;
    plateNumber: string;
    driverName: string;
    driverId: string;
    vehicleType: string;
    itemType: string; // Jenis Barang
    total: string;
    buyer: string; // Pembeli
    approvedBy: string; // Disetujui Oleh
    identityNote: string;
    checkInTime: string;
    status: AfkirStatus;
    checkOutTime?: string;
    sync_status: 0 | 1;
}

export interface ContainerRecord {
    id: string;
    plateNumber: string;
    driverName: string;
    driverId: string;
    vehicleType: string;
    cargo: string;
    total: string;
    containerIn: string;
    identityNote: string;
    checkInTime: string;
    status: ContainerStatus;
    containerOut?: string;
    checkOutTime?: string;
    sync_status: 0 | 1;
}

export interface KeyRecord {
    id: string;
    keyName: string;
    depositorName: string;
    depositorDivision: string;
    depositTime: string;
    status: KeyStatus;
    takerName?: string;
    takerDivision?: string;
    keterangan?: string;
    takeTime?: string;
    sync_status: 0 | 1;
}

export interface MutasiRecord {
    id: string;
    posName: string;
    shiftName: string;
    date: string;
    createdBy: string;
    status: 'ACTIVE' | 'SUBMITTED' | 'APPROVED';
    sync_status: 0 | 1;
}

export interface MutasiMemberRecord {
    id: string;
    mutationId: string;
    guardName: string;
    attendance: 'HADIR' | 'SAKIT' | 'IZIN';
    sync_status: 0 | 1;
}

export interface MutasiActivityRecord {
    id: string;
    mutationId: string;
    guardName: string;
    time: string;
    description: string;
    sync_status: 0 | 1;
}

// --- Store Definition ---
interface ModuleState {
    // Container Log State
    containers: ContainerRecord[];
    checkinContainer: (plateNumber: string, driverName: string, driverId: string, vehicleType: string, cargo: string, total: string, containerIn: string, identityNote: string) => void;
    checkoutContainer: (id: string, containerOut: string) => void;

    // Afkir Log State
    afkirs: AfkirRecord[];
    checkinAfkir: (plateNumber: string, driverName: string, driverId: string, vehicleType: string, itemType: string, total: string, buyer: string, approvedBy: string, identityNote: string) => void;
    checkoutAfkir: (id: string) => void;

    // Izin Staff State
    izins: IzinRecord[];
    createIzin: (name: string, department: string, reasonType: 'Kerja' | 'Pribadi', destination: string, note: string) => void;
    finishIzin: (id: string) => void;

    // Key Log State
    keys: KeyRecord[];
    depositKey: (keyName: string, depositorName: string, depositorDivision: string) => void;
    takeKey: (id: string, takerName: string, takerDivision: string, keterangan: string) => void;

    // Mutasi State
    mutations: MutasiRecord[];
    mutationMembers: Record<string, MutasiMemberRecord[]>; // Indexed by mutationId
    mutationActivities: Record<string, MutasiActivityRecord[]>; // Indexed by mutationId

    createMutation: (posName: string, shiftName: string, createdBy: string, members: Array<{ guardName: string; attendance: 'HADIR' | 'SAKIT' | 'IZIN' }>) => void;
    joinMutation: (mutationId: string, guardName: string, attendance: 'HADIR' | 'SAKIT' | 'IZIN') => void;
    addMutationActivity: (mutationId: string, time: string, description: string, currentLoggedInUser: string) => void;
    submitMutation: (mutationId: string) => void;

    // Sync functions
    markAsSynced: (type: 'containers' | 'afkirs' | 'izins' | 'keys' | 'mutations' | 'mutationMembers' | 'mutationActivities', id: string) => void;
    syncServerData: (type: 'containers' | 'afkirs' | 'izins' | 'keys' | 'mutations' | 'mutationMembers' | 'mutationActivities', mappedServerData: any[]) => void;
    upsertRecord: (type: 'containers' | 'afkirs' | 'izins' | 'keys' | 'mutations', record: any) => void;
    approveRecord: (type: 'containers' | 'afkirs' | 'izins' | 'keys' | 'mutations', id: string) => void;
    clearAll: () => void;
}

const initialContainers: ContainerRecord[] = [];
const initialAfkirs: AfkirRecord[] = [];
const initialIzins: IzinRecord[] = [];
const initialKeys: KeyRecord[] = [];
const initialMutations: MutasiRecord[] = [];
const initialMutationMembers: Record<string, MutasiMemberRecord[]> = {};
const initialMutationActivities: Record<string, MutasiActivityRecord[]> = {};

export const useModuleStore = create<ModuleState>()(
    persist(
        (set) => ({
            containers: initialContainers,
            afkirs: initialAfkirs,
            izins: initialIzins,
            keys: initialKeys,
            mutations: initialMutations,
            mutationMembers: initialMutationMembers,
            mutationActivities: initialMutationActivities,

            createIzin: (name, department, reasonType, destination, note) =>
                set((state) => ({
                    izins: [{
                        id: `izn-${Date.now()}`,
                        name,
                        department,
                        reasonType,
                        destination,
                        note,
                        timeOut: new Date().toISOString(),
                        status: 'OUT',
                        sync_status: 0
                    }, ...state.izins]
                })),

            finishIzin: (id) =>
                set((state) => ({
                    izins: state.izins.map((i) =>
                        i.id === id ? { ...i, status: 'RETURNED', timeIn: new Date().toISOString(), sync_status: 0 } : i
                    ),
                })),

            checkinAfkir: (plateNumber, driverName, driverId, vehicleType, itemType, total, buyer, approvedBy, identityNote) =>
                set((state) => ({
                    afkirs: [{
                        id: `afk-${Date.now()}`,
                        plateNumber,
                        driverName,
                        driverId,
                        vehicleType,
                        itemType,
                        total,
                        buyer,
                        approvedBy,
                        identityNote,
                        checkInTime: new Date().toISOString(),
                        status: 'IN',
                        sync_status: 0
                    }, ...state.afkirs]
                })),

            checkoutAfkir: (id) =>
                set((state) => ({
                    afkirs: state.afkirs.map((a) =>
                        a.id === id ? { ...a, status: 'OUT', checkOutTime: new Date().toISOString(), sync_status: 0 } : a
                    ),
                })),

            checkinContainer: (plateNumber, driverName, driverId, vehicleType, cargo, total, containerIn, identityNote) =>
                set((state) => ({
                    containers: [{
                        id: `cnt-${Date.now()}`,
                        plateNumber,
                        driverName,
                        driverId,
                        vehicleType,
                        cargo,
                        total,
                        containerIn,
                        identityNote,
                        checkInTime: new Date().toISOString(),
                        status: 'IN',
                        sync_status: 0
                    }, ...state.containers]
                })),

            checkoutContainer: (id, containerOut) =>
                set((state) => ({
                    containers: state.containers.map((c) =>
                        c.id === id ? { ...c, status: 'OUT', containerOut, checkOutTime: new Date().toISOString(), sync_status: 0 } : c
                    ),
                })),

            depositKey: (keyName, depositorName, depositorDivision) =>
                set((state) => ({
                    keys: [{
                        id: `key-${Date.now()}`,
                        keyName,
                        depositorName,
                        depositorDivision,
                        depositTime: new Date().toISOString(),
                        status: 'DEPOSITED',
                        sync_status: 0
                    }, ...state.keys]
                })),

            takeKey: (id, takerName, takerDivision, keterangan) =>
                set((state) => ({
                    keys: state.keys.map((k) =>
                        k.id === id ? { ...k, status: 'TAKEN', takerName, takerDivision, keterangan, takeTime: new Date().toISOString(), sync_status: 0 } : k
                    ),
                })),

            createMutation: (posName, shiftName, createdBy, members = []) =>
                set((state) => {
                    const newMutationId = `mut-${Date.now()}`;
                    const newMutation: MutasiRecord = {
                        id: newMutationId,
                        posName,
                        shiftName,
                        date: new Date().toISOString(),
                        createdBy,
                        status: 'ACTIVE',
                        sync_status: 0
                    };

                    const newMembers: MutasiMemberRecord[] = members.map((m, index) => ({
                        id: `mem-${Date.now()}-${index}`,
                        mutationId: newMutationId,
                        guardName: m.guardName,
                        attendance: m.attendance,
                        sync_status: 0
                    }));

                    return {
                        mutations: [newMutation, ...state.mutations],
                        mutationMembers: {
                            ...state.mutationMembers,
                            [newMutationId]: newMembers
                        }
                    };
                }),

            joinMutation: (mutationId, guardName, attendance) =>
                set((state) => {
                    const existingMembers = state.mutationMembers[mutationId] || [];
                    if (existingMembers.some(m => m.guardName === guardName)) return state;

                    const newMember: MutasiMemberRecord = {
                        id: `mem-${Date.now()}`,
                        mutationId: mutationId,
                        guardName: guardName,
                        attendance: attendance,
                        sync_status: 0
                    };

                    return {
                        mutationMembers: {
                            ...state.mutationMembers,
                            [mutationId]: [newMember, ...existingMembers]
                        }
                    };
                }),

            addMutationActivity: (mutationId, time, description, currentLoggedInUser) =>
                set((state) => {
                    const newActivity: MutasiActivityRecord = {
                        id: `act-${Date.now()}`,
                        mutationId,
                        time,
                        description,
                        guardName: currentLoggedInUser,
                        sync_status: 0
                    };
                    const existingActivities = state.mutationActivities[mutationId] || [];
                    return {
                        mutationActivities: {
                            ...state.mutationActivities,
                            [mutationId]: [...existingActivities, newActivity]
                        }
                    };
                }),

            submitMutation: (mutationId) =>
                set((state) => ({
                    mutations: state.mutations.map((m) =>
                        m.id === mutationId ? { ...m, status: 'SUBMITTED', sync_status: 0 } : m
                    )
                })),

            markAsSynced: (type, id) =>
                set((state) => {
                    if (type === 'mutationMembers' || type === 'mutationActivities') {
                        const newState = { ...state[type] } as any;
                        for (const key in newState) {
                            newState[key] = newState[key].map((item: any) =>
                                item.id === id ? { ...item, sync_status: 1 } : item
                            );
                        }
                        return { [type]: newState };
                    }
                    return {
                        [type]: (state[type] as any[]).map((item) =>
                            item.id === id ? { ...item, sync_status: 1 } : item
                        )
                    };
                }),

            syncServerData: (type, mappedServerData) =>
                set((state) => {
                    if (type === 'mutationMembers' || type === 'mutationActivities') {
                        const nextState = { ...state[type] } as any;

                        // Group incoming server data by mutationId
                        const groupedServer = mappedServerData.reduce((acc, item) => {
                            // Support both backend 'mutasiId' and frontend 'mutationId'
                            const mid = item.mutationId || item.mutasiId;
                            if (mid) {
                                if (!acc[mid]) acc[mid] = [];
                                // Ensure the item in store uses 'mutationId' for consistency
                                acc[mid].push({ ...item, mutationId: mid, sync_status: 1 });
                            }
                            return acc;
                        }, {} as Record<string, any[]>);

                        // Merge for each affected mutationId
                        for (const mid in groupedServer) {
                            const localItems = state[type][mid] || [];
                            const serverIds = new Set(groupedServer[mid].map((s: any) => s.id));
                            const pendingLocal = localItems.filter(li => !serverIds.has(li.id) && li.sync_status === 0);
                            nextState[mid] = [...pendingLocal, ...groupedServer[mid]];
                        }

                        return { [type]: nextState };
                    }

                    const localItems = state[type] as any[];
                    const serverIds = new Set(mappedServerData.map((d: any) => d.id));
                    const pendingLocalItems = localItems.filter(i => !serverIds.has(i.id) && i.sync_status === 0);
                    const serverItems = mappedServerData.map((d: any) => ({ ...d, sync_status: 1 }));
                    return { [type]: [...pendingLocalItems, ...serverItems] };
                }),

            upsertRecord: (type, record) =>
                set((state) => {
                    if (type === ('mutationMembers' as any) || type === ('mutationActivities' as any)) {
                        const mid = record.mutationId || record.mutasiId;
                        if (!mid) return state;
                        const existingList = state[type as any][mid] || [];
                        const exists = existingList.find((i: any) => i.id === record.id);
                        const newList = exists
                            ? existingList.map((i: any) => i.id === record.id ? { ...i, ...record, mutationId: mid, sync_status: 1 } : i)
                            : [...existingList, { ...record, mutationId: mid, sync_status: 1 }];
                        return {
                            [type]: {
                                ...state[type as any],
                                [mid]: newList
                            }
                        };
                    }
                    const existing = (state[type] as any[]).find(item => item.id === record.id);
                    if (existing) {
                        return {
                            [type]: (state[type] as any[]).map(item =>
                                item.id === record.id ? { ...item, ...record, sync_status: 1 } : item
                            )
                        };
                    }
                    return { [type]: [...(state[type] as any[]), { ...record, sync_status: 1 }] };
                }),

            approveRecord: (type, id) =>
                set((state) => ({
                    [type]: (state[type] as any[]).map((item) =>
                        item.id === id ? { ...item, status: 'APPROVED' } : item
                    )
                })),

            clearAll: () => set({
                containers: [],
                afkirs: [],
                izins: [],
                keys: [],
                mutations: [],
                mutationMembers: {},
                mutationActivities: {}
            })
        }),
        {
            name: 'module-storage-v6', // Bump again
            version: 6,
            storage: createJSONStorage(() => AsyncStorage),
            migrate: (persistedState: any, version: number) => {
                if (version < 5) {
                    const state = persistedState as any;
                    const members = state.mutationMembers || [];
                    const activities = state.mutationActivities || [];
                    const memberMap: Record<string, any[]> = {};
                    members.forEach((m: any) => {
                        const mid = m.mutationId || m.mutasiId;
                        if (mid) {
                            if (!memberMap[mid]) memberMap[mid] = [];
                            memberMap[mid].push({ ...m, mutationId: mid });
                        }
                    });
                    const activityMap: Record<string, any[]> = {};
                    activities.forEach((a: any) => {
                        const mid = a.mutationId || a.mutasiId;
                        if (mid) {
                            if (!activityMap[mid]) activityMap[mid] = [];
                            activityMap[mid].push({ ...a, mutationId: mid });
                        }
                    });
                    return {
                        ...state,
                        mutationMembers: memberMap,
                        mutationActivities: activityMap,
                    };
                }
                return persistedState as any;
            },
        }
    )
);
