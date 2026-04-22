import { SyncBadge } from '@/components/ui/SyncBadge';
import { KeyRecord } from '@/store/useModuleStore';
import { useRouter } from 'expo-router';
import { Clock, Key, UserCheck } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface KeyLogCardProps {
    keyRecord: KeyRecord;
}

export function KeyLogCard({ keyRecord }: KeyLogCardProps) {
    const router = useRouter();

    const handleTakeKey = () => {
        router.push(`/modules/keylog/${keyRecord.id}/ambil` as any);
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            activeOpacity={0.7}
            onPress={() => router.push(`/modules/keylog/${keyRecord.id}/detail` as any)}
        >
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                        <Key size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1 pr-4">
                        <View className="flex-row items-start justify-between mb-0.5">
                            <Text className="text-slate-800 text-[15px] font-bold flex-1 mr-2" numberOfLines={1}>{keyRecord.keyName}</Text>
                            <SyncBadge status={keyRecord.sync_status || 0} business_status={keyRecord.status} moduleType="KEYLOG" />
                        </View>
                        <Text className="text-slate-500 text-[12px] font-medium mt-0.5">Titip: {keyRecord.depositorName} ({keyRecord.depositorDivision})</Text>
                    </View>
                </View>
            </View>

            <View className="flex-col gap-1.5 mb-1 pt-3 mt-1 border-t border-slate-100">
                <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-500 text-[12px] font-medium ml-1">
                        Waktu Titip: {formatTime(keyRecord.depositTime)}
                    </Text>
                </View>

                {keyRecord.status === 'TAKEN' ? (
                    <View className="flex-row items-center mt-1">
                        <UserCheck size={12} color="#10b981" />
                        <Text className="text-emerald-600 text-[12px] font-medium ml-1">
                            Diambil oleh: {keyRecord.takerName} ({formatTime(keyRecord.takeTime)})
                        </Text>
                    </View>
                ) : null}
            </View>

            {keyRecord.status === 'DEPOSITED' ? (
                <View className="flex-row space-x-3 gap-3 pt-3 mt-1">
                    <TouchableOpacity
                        className="flex-1 bg-[#ea580c] py-2.5 rounded-xl flex-row items-center justify-center shadow-sm active:bg-orange-600"
                        activeOpacity={0.8}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleTakeKey();
                        }}
                    >
                        <Text className="text-white font-bold text-[13px] uppercase">Ambil Kunci</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </TouchableOpacity>
    );
}
