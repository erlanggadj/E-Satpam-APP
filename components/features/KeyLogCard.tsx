import { KeyRecord, useModuleStore } from '@/store/useModuleStore';

import { useAuthStore } from '@/store/useAuthStore';
import { Clock, Key, UserCheck } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface KeyLogCardProps {
    keyRecord: KeyRecord;
    onAfterTake?: () => void;
}

export function KeyLogCard({ keyRecord, onAfterTake }: KeyLogCardProps) {
    const takeKey = useModuleStore(state => state.takeKey);
    const user = useAuthStore(state => state.user);

    const handleTakeKey = () => {
        setTimeout(() => {
            takeKey(keyRecord.id, user ? user.name : 'Sistem', 'Peminjam Eksternal', new Date().toISOString());
            if (onAfterTake) onAfterTake();
        }, 300);
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                        <Key size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1 pr-4">
                        <Text className="text-slate-800 text-[15px] font-bold" numberOfLines={1}>{keyRecord.keyName}</Text>
                        <Text className="text-slate-500 text-[12px] font-medium mt-0.5">Titip: {keyRecord.depositedBy}</Text>
                    </View>
                </View>
                {keyRecord.status === 'TAKEN' ? (
                    <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        <Text className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Selesai</Text>
                    </View>
                ) : (
                    <View className="bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <Text className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Tersedia</Text>
                    </View>
                )}
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
                            Diambil oleh: {keyRecord.takenBy} ({formatTime(keyRecord.takeTime)})
                        </Text>
                    </View>
                ) : null}
            </View>

            {keyRecord.status === 'DEPOSITED' ? (
                <View className="flex-row space-x-3 gap-3 pt-3 mt-1">
                    <TouchableOpacity
                        className="flex-1 bg-[#ea580c] py-2.5 rounded-xl flex-row items-center justify-center shadow-sm active:bg-orange-600"
                        activeOpacity={0.7}
                        onPress={handleTakeKey}
                    >
                        <Text className="text-white font-bold text-[13px] uppercase">Ambil Kunci</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
}
