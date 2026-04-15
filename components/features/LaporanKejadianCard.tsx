import { useRouter } from 'expo-router';
import { AlertCircle, Calendar } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface KejadianReport {
    id: string;
    nomor: string;
    perihal: string;
    waktu: string;
    status: 'DIPROSES' | 'SELESAI';
}

interface Props {
    item: KejadianReport;
}

export function LaporanKejadianCard({ item }: Props) {
    const router = useRouter();
    const isNavigating = useRef(false);

    const handlePress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/kejadian/${item.id}/detail` as any);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const isDone = item.status === 'SELESAI';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex-row"
            onPress={handlePress}
        >
            <View className="mr-4 items-center">
                <View className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-1">
                    <AlertCircle size={24} color="#ea580c" />
                </View>
            </View>

            <View className="flex-1 justify-center">
                <View className="flex-row items-start justify-between mb-1">
                    <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex-1 mr-2" numberOfLines={1}>{item.nomor}</Text>
                    {isDone ? (
                        <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            <Text className="text-emerald-700 text-[9px] font-bold uppercase tracking-widest">Selesai</Text>
                        </View>
                    ) : (
                        <View className="bg-orange-50 px-2 py-1 rounded border border-orange-100">
                            <Text className="text-orange-600 text-[9px] font-bold uppercase tracking-widest">Diproses</Text>
                        </View>
                    )}
                </View>

                <Text className="text-slate-800 text-[15px] font-bold tracking-tight mb-2 mt-1" numberOfLines={2}>
                    {item.perihal}
                </Text>

                <View className="flex-row items-center border-t border-slate-100 pt-3 mt-1">
                    <Calendar size={12} color="#94a3b8" />
                    <Text className="text-slate-500 text-[12px] font-medium ml-1.5">
                        {item.waktu}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
