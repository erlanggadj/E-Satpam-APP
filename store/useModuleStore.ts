import { create } from 'zustand';

// --- Data Types ---
export type ContainerStatus = 'IN' | 'OUT';
export type KeyStatus = 'DEPOSITED' | 'TAKEN';

export type IzinStatus = 'OUT' | 'RETURNED';

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
}

export type AfkirStatus = 'IN' | 'OUT';

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
        driverId: '3201012345678901',
        vehicleType: 'Hino 500',
        cargo: 'Pupuk Urea',
        total: '25 Ton',
        containerIn: 'MSKU 123456-7',
        identityNote: 'KTP ditahan di pos',
        checkInTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'IN',
    },
    {
        id: 'cnt-2',
        plateNumber: 'BE 8812 AZ',
        driverName: 'Junaidi',
        driverId: '3171012345678902',
        vehicleType: 'Fuso Fighter',
        cargo: 'Alat Berat',
        total: '1 Unit',
        containerIn: 'TGHU 876543-2',
        identityNote: 'SIM mati, menaruh jaminan STNK',
        checkInTime: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        status: 'OUT',
        containerOut: 'TGHU 876543-2', // Taken same container out
        checkOutTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
];

const initialAfkirs: AfkirRecord[] = [
    {
        id: 'afk-1',
        plateNumber: 'B 9299 ZX',
        driverName: 'Surya',
        driverId: '3201012345678123',
        vehicleType: 'Pickup L300',
        itemType: 'Besi Tua Scrap',
        total: '100 Kg',
        buyer: 'PT Rongsok Maju',
        approvedBy: 'Bapak Hartanto',
        identityNote: 'KTP asli disimpan di laci',
        checkInTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        status: 'IN',
    }
];

const initialIzins: IzinRecord[] = [
    {
        id: 'izn-1',
        name: 'Handoko Suryadi',
        department: 'Produksi',
        reasonType: 'Kerja',
        destination: 'Pabrik 2 GGF',
        note: 'Mengambil alat sparepart mesin.',
        timeOut: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: 'OUT',
    },
    {
        id: 'izn-2',
        name: 'Siti Maimunah',
        department: 'HRD',
        reasonType: 'Pribadi',
        destination: 'Bank BCA',
        note: 'Keperluan darurat kehilangan kartu ATM.',
        timeOut: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        timeIn: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        status: 'RETURNED',
    }
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
                status: 'OUT'
            }, ...state.izins]
        })),

    finishIzin: (id) =>
        set((state) => ({
            izins: state.izins.map((i) =>
                i.id === id ? { ...i, status: 'RETURNED', timeIn: new Date().toISOString() } : i
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
                status: 'IN'
            }, ...state.afkirs]
        })),

    checkoutAfkir: (id) =>
        set((state) => ({
            afkirs: state.afkirs.map((a) =>
                a.id === id ? { ...a, status: 'OUT', checkOutTime: new Date().toISOString() } : a
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
                status: 'IN'
            }, ...state.containers]
        })),

    checkoutContainer: (id, containerOut) =>
        set((state) => ({
            containers: state.containers.map((c) =>
                c.id === id ? { ...c, status: 'OUT', containerOut, checkOutTime: new Date().toISOString() } : c
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
