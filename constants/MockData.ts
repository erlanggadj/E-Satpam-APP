import {
    BadgeInfo,
    BookUser,
    ClipboardEdit,
    FileCheck,
    Key,
    Recycle,
    TriangleAlert,
    Truck,
} from 'lucide-react-native';

export const MODULES = [
    { id: 'mutasi', title: 'Lembar Mutasi', icon: ClipboardEdit },
    { id: 'tamu', title: 'Buku Tamu', icon: BookUser },
    { id: 'kejadian', title: 'Log Kejadian', icon: TriangleAlert },
    { id: 'keylog', title: 'Log Kunci', icon: Key },
    { id: 'piket', title: 'Piket Staff', icon: BadgeInfo },
    { id: 'container', title: 'Log Kontainer', icon: Truck },
    { id: 'afkir', title: 'Log Afkir', icon: Recycle },
    { id: 'izin', title: 'Izin Staff', icon: FileCheck },
];
