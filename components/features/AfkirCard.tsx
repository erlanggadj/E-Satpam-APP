import { AfkirRecord, useModuleStore } from '@/store/useModuleStore';
import { useRouter } from 'expo-router';
import { ArrowRightCircle, CheckCircle2, Clock, PackageOpen } from 'lucide-react-native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface AfkirCardProps {
    afkir: AfkirRecord;
}

export function AfkirCard({ afkir }: AfkirCardProps) {
    const router = useRouter();
    const checkoutAfkir = useModuleStore(state => state.checkoutAfkir);
    const isNavigating = React.useRef(false);

    const handleDetailPress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/afkir/${afkir.id}/detail` as any);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const handleCheckoutPress = () => {
        if (isNavigating.current) return;
        Alert.alert(
            "Konfirmasi Kendaraan Keluar",
            "Apakah Anda yakin kendaraan ini sudah melewati batas pemeriksaan dan keluar area?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Iya, Keluar",
                    style: "destructive",
                    onPress: () => checkoutAfkir(afkir.id)
                }
            ]
        );
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-gray-100 flex-row"
            activeOpacity={0.7}
            onPress={handleDetailPress}
        >
            {/* Icon Area */}
            <View className="mr-4 items-center">
                <View className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-1">
                    <PackageOpen size={24} color="#6366f1" />
                </View>
                {afkir.status === 'OUT' ? (
                    <View className="bg-emerald-100 px-2 py-0.5 rounded flex-row items-center mt-1">
                        <CheckCircle2 size={10} color="#10B981" />
                        <Text className="text-emerald-700 text-[9px] font-bold ml-1 uppercase">Selesai</Text>
                    </View>
                ) : (
                    <View className="bg-indigo-100 px-2 py-0.5 rounded mt-1 flex-row items-center">
                        <Clock size={10} color="#4f46e5" />
                        <Text className="text-indigo-700 text-[9px] font-bold ml-1 uppercase">Di Area</Text>
                    </View>
                )}
            </View>

            {/* Main Info Area */}
            <View className="flex-1 justify-center relative">
                <Text className="text-slate-800 text-[18px] font-bold tracking-tight mb-0.5" numberOfLines={1}>
                    {afkir.plateNumber}
                </Text>
                <Text className="text-slate-500 text-[13px] font-medium mb-2">
                    {afkir.buyer} • {afkir.itemType}
                </Text>

                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <Clock size={12} color="#94a3b8" />
                        <Text className="text-slate-500 text-[11px] font-medium ml-1">
                            Masuk: {formatTime(afkir.checkInTime)}
                        </Text>
                    </View>

                    {afkir.status === 'OUT' && (
                        <View className="flex-row items-center">
                            <ArrowRightCircle size={12} color="#10B981" />
                            <Text className="text-emerald-600 text-[11px] font-medium ml-1">
                                Keluar: {formatTime(afkir.checkOutTime)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Button */}
                {afkir.status === 'IN' && (
                    <TouchableOpacity
                        className="mt-3 py-2.5 px-4 rounded-xl border border-indigo-500 bg-indigo-50 flex-row justify-center items-center active:bg-indigo-100"
                        activeOpacity={0.8}
                        onPress={handleCheckoutPress}
                    >
                        <Text className="text-indigo-600 font-bold text-[13px] tracking-wide uppercase">
                            Kendaraan Keluar
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}
