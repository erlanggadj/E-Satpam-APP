import { SyncBadge } from '@/components/ui/SyncBadge';
import { syncAllPendingData } from '@/hooks/useBackgroundSync';
import { IzinRecord, useModuleStore } from '@/store/useModuleStore';
import { useRouter } from 'expo-router';
import { ArrowRightCircle, BriefcaseBusiness, CheckCircle2, Clock, MapPin, User } from 'lucide-react-native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface IzinCardProps {
    izin: IzinRecord;
}

export function IzinCard({ izin }: IzinCardProps) {
    const router = useRouter();
    const finishIzin = useModuleStore(state => state.finishIzin);
    const isNavigating = React.useRef(false);

    const handleDetailPress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/izin/${izin.id}/detail` as any);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const handleReturnPress = () => {
        if (isNavigating.current) return;
        Alert.alert(
            "Konfirmasi Karyawan Kembali",
            `Apakah Anda yakin ${izin.name} sudah kembali dan memasuki area pabrik?`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Iya, Masuk",
                    style: "default",
                    onPress: () => {
                        finishIzin(izin.id);
                        syncAllPendingData();
                    }
                }
            ]
        );
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isBusiness = izin.reasonType === 'Kerja';
    const IconColor = isBusiness ? '#2563eb' : '#db2777'; // Blue for business, Pink for personal
    const BgColor = isBusiness ? 'bg-blue-50' : 'bg-pink-50';

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-gray-100 flex-row"
            activeOpacity={0.7}
            onPress={handleDetailPress}
        >
            {/* Icon Area */}
            <View className="mr-4 items-center">
                <View className={`w-12 h-12 ${BgColor} rounded-xl flex items-center justify-center mb-1`}>
                    {isBusiness ? <BriefcaseBusiness size={24} color={IconColor} /> : <User size={24} color={IconColor} />}
                </View>
                {izin.status === 'RETURNED' ? (
                    <View className="bg-emerald-100 px-2 py-0.5 rounded flex-row items-center mt-1">
                        <CheckCircle2 size={10} color="#10B981" />
                        <Text className="text-emerald-700 text-[9px] font-bold ml-1 uppercase">Selesai</Text>
                    </View>
                ) : (
                    <View className="bg-amber-100 px-2 py-0.5 rounded mt-1 flex-row items-center">
                        <Clock size={10} color="#d97706" />
                        <Text className="text-amber-700 text-[9px] font-bold ml-1 uppercase">Di Luar</Text>
                    </View>
                )}
            </View>

            {/* Main Info Area */}
            <View className="flex-1 justify-center relative">
                <View className="flex-row justify-between items-start mb-0.5">
                    <Text className="text-slate-800 text-[17px] font-bold tracking-tight flex-1 mr-2" numberOfLines={1}>
                        {izin.name}
                    </Text>
                    <SyncBadge status={izin.sync_status || 0} business_status={izin.status} moduleType="IZIN" />
                </View>

                <View className="flex-row items-center mb-2">
                    <MapPin size={11} color="#64748b" style={{ marginRight: 4 }} />
                    <Text className="text-slate-500 text-[12px] font-medium" numberOfLines={1}>
                        {izin.department} • {izin.destination}
                    </Text>
                </View>

                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <ArrowRightCircle size={12} color="#f59e0b" />
                        <Text className="text-slate-500 text-[11px] font-medium ml-1">
                            Keluar: {formatTime(izin.timeOut)}
                        </Text>
                    </View>

                    {izin.status === 'RETURNED' && (
                        <View className="flex-row items-center">
                            <CheckCircle2 size={12} color="#10B981" />
                            <Text className="text-emerald-600 text-[11px] font-medium ml-1">
                                Masuk: {formatTime(izin.timeIn)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Button */}
                {izin.status === 'OUT' && (
                    <TouchableOpacity
                        className="mt-3 py-2.5 px-4 rounded-xl border border-sky-500 bg-sky-50 flex-row justify-center items-center active:bg-sky-100"
                        activeOpacity={0.8}
                        onPress={handleReturnPress}
                    >
                        <Text className="text-sky-600 font-bold text-[13px] tracking-wide uppercase">
                            Karyawan Kembali (Masuk)
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}
