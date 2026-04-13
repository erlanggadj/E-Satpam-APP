import { create } from 'zustand';

// --- Data Types ---
export type ContainerStatus = 'IN' | 'OUT';
export type KeyStatus = 'DEPOSITED' | 'TAKEN';

export interface ContainerRecord {
    id: string;
    plateNumber: string;
    driverName: string;
    cargo: string;
    checkInTime: string;
    status: ContainerStatus;
    checkOutTime?: string;
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
}

export interface MutasiRecord {
    id: string;
    posName: string;
    shiftName: string;
    date: string;
    createdBy: string;
    status: 'ACTIVE' | 'SUBMITTED';
}

export interface MutasiMemberRecord {
    id: string;
    mutationId: string;
    guardName: string;
    attendance: 'HADIR' | 'SAKIT' | 'IZIN';
}

export interface MutasiActivityRecord {
    id: string;
    mutationId: string;
    guardName: string;
    time: string;
    description: string;
}

// --- Store Definition ---
interface ModuleState {
    // Container Log State
    containers: ContainerRecord[];
    checkoutContainer: (id: string, checkOutTime: string) => void;

    // Key Log State
    keys: KeyRecord[];
    depositKey: (keyName: string, depositorName: string, depositorDivision: string) => void;
    takeKey: (id: string, takerName: string, takerDivision: string, keterangan: string) => void;

    // Mutasi State
    mutations: MutasiRecord[];
    mutationMembers: MutasiMemberRecord[];
    mutationActivities: MutasiActivityRecord[];

    createMutation: (posName: string, shiftName: string, createdBy: string, members: Array<{ guardName: string; attendance: 'HADIR' | 'SAKIT' | 'IZIN' }>) => void;
    joinMutation: (mutationId: string, guardName: string, attendance: 'HADIR' | 'SAKIT' | 'IZIN') => void;
    addMutationActivity: (mutationId: string, time: string, description: string, currentLoggedInUser: string) => void;
    submitMutation: (mutationId: string) => void;
}

// Initial Mock Data
const initialContainers: ContainerRecord[] = [
    {
        id: 'cnt-1',
        plateNumber: 'B 9201 TE',
        driverName: 'Suroso',
        cargo: 'Pupuk Urea',
        checkInTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        status: 'IN',
    },
    {
        id: 'cnt-2',
        plateNumber: 'BE 8812 AZ',
        driverName: 'Junaidi',
        cargo: 'Alat Berat',
        checkInTime: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
        status: 'OUT',
        checkOutTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
    {
        id: 'cnt-3',
        plateNumber: 'B 1104 FQ',
        driverName: 'Agus Santoso',
        cargo: 'Bahan Kimia',
        checkInTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        status: 'IN',
    },
];

const initialKeys: KeyRecord[] = [
    {
        id: 'key-1',
        keyName: 'Ruang Server IT',
        depositorName: 'Handoko',
        depositorDivision: 'Staff IT',
        depositTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: 'DEPOSITED',
    },
    {
        id: 'key-2',
        keyName: 'Gudang Logistik C',
        depositorName: 'Bambang',
        depositorDivision: 'Gudang',
        depositTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        status: 'TAKEN',
        takerName: 'Mulyanto',
        takerDivision: 'Logistik Area',
        keterangan: 'Pengecekan stok',
        takeTime: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    },
];

const initialMutations: MutasiRecord[] = [
    {
        id: 'mut-1',
        posName: 'Pos Utama - Gate 1',
        shiftName: 'Shift Siang (07:00 - 15:00)',
        date: new Date().toISOString(),
        createdBy: 'Budi Santoso',
        status: 'ACTIVE',
    },
    {
        id: 'mut-2',
        posName: 'Pos Gudang Belakang',
        shiftName: 'Shift Pagi (00:00 - 07:00)',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdBy: 'Junaidi',
        status: 'SUBMITTED',
    }
];

const initialMutationMembers: MutasiMemberRecord[] = [
    { id: 'mem-1', mutationId: 'mut-1', guardName: 'Budi Santoso', attendance: 'HADIR' },
    { id: 'mem-2', mutationId: 'mut-1', guardName: 'Agus Subroto', attendance: 'HADIR' },
    { id: 'mem-3', mutationId: 'mut-2', guardName: 'Junaidi', attendance: 'HADIR' },
    { id: 'mem-4', mutationId: 'mut-2', guardName: 'Hartoko', attendance: 'SAKIT' },
];

const initialMutationActivities: MutasiActivityRecord[] = [
    { id: 'act-1', mutationId: 'mut-1', guardName: 'Budi Santoso', time: '07:00', description: 'Serah terima penjagaan dari Shift Pagi dengan barang inventaris lengkap.' },
    { id: 'act-2', mutationId: 'mut-1', guardName: 'Agus Subroto', time: '08:30', description: 'Patroli area ring luar, terpantau situasi aman dan terkendali.' },
    { id: 'act-3', mutationId: 'mut-2', guardName: 'Junaidi', time: '00:00', description: 'Serah terima. Anggota lengkap, inventaris HT dan Senter berfungsi baik.' },
];

export const useModuleStore = create<ModuleState>((set) => ({
    containers: initialContainers,
    keys: initialKeys,
    mutations: initialMutations,
    mutationMembers: initialMutationMembers,
    mutationActivities: initialMutationActivities,

    checkoutContainer: (id, checkOutTime) =>
        set((state) => ({
            containers: state.containers.map((c) =>
                c.id === id ? { ...c, status: 'OUT', checkOutTime } : c
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
                status: 'DEPOSITED'
            }, ...state.keys]
        })),

    takeKey: (id, takerName, takerDivision, keterangan) =>
        set((state) => ({
            keys: state.keys.map((k) =>
                k.id === id ? { ...k, status: 'TAKEN', takerName, takerDivision, keterangan, takeTime: new Date().toISOString() } : k
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
            };

            const newMembers: MutasiMemberRecord[] = members.map((m, index) => ({
                id: `mem-${Date.now()}-${index}`,
                mutationId: newMutationId,
                guardName: m.guardName,
                attendance: m.attendance
            }));

            return {
                mutations: [newMutation, ...state.mutations],
                mutationMembers: [...newMembers, ...state.mutationMembers]
            };
        }),

    joinMutation: (mutationId, guardName, attendance) =>
        set((state) => {
            const exists = state.mutationMembers.some(
                m => m.mutationId === mutationId && m.guardName === guardName
            );
            if (exists) return state; // Avoid duplicate joining

            const newMember: MutasiMemberRecord = {
                id: `mem-${Date.now()}`,
                mutationId: mutationId,
                guardName: guardName,
                attendance: attendance
            };

            return {
                mutationMembers: [newMember, ...state.mutationMembers]
            };
        }),


    addMutationActivity: (mutationId, time, description, currentLoggedInUser) =>
        set((state) => {
            const newActivity: MutasiActivityRecord = {
                id: `act-${Date.now()}`,
                mutationId,
                time,
                description,
                guardName: currentLoggedInUser
            };
            return {
                mutationActivities: [...state.mutationActivities, newActivity]
            };
        }),

    submitMutation: (mutationId) =>
        set((state) => ({
            mutations: state.mutations.map((m) =>
                m.id === mutationId ? { ...m, status: 'SUBMITTED' } : m
            )
        }))
}));
