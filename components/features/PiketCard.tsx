import { ModuleIcon } from '@/components/features/ModuleIcon';
import { SyncItem } from '@/store/useSyncStore';
import { useRouter } from 'expo-router';
import { CheckCircle2, Clock, SearchCheck, UserCircle2 } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PiketCardProps {
    item: SyncItem;
}

export function PiketCard({ item }: PiketCardProps) {
    const router = useRouter();
    const { lokasi, petugas, hasil } = item.data;
    const isPending = item.sync_status === 0;

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            activeOpacity={0.7}
            onPress={() => router.push(`/modules/piket/${item.id}/detail` as any)}
        >
            {/* Header: Lokasi & Status */}
            <View className="flex-row items-center justify-between mb-3 border-b border-slate-50 pb-3">
                <View className="flex-row items-center flex-1">
                    <View className="mr-2 -ml-1 transform scale-75">
                        <ModuleIcon id="piket" />
                    </View>
                    <View className="flex-1 pr-4">
                        <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">Lokasi Visit</Text>
                        <Text className="text-slate-800 text-[15px] font-bold" numberOfLines={1}>{lokasi || 'Lokasi Tidak Diketahui'}</Text>
                    </View>
                </View>

                {/* SYNC STATUS BADGE */}
                {isPending ? (
                    <View className="bg-orange-50 px-2 py-1 rounded border border-orange-100 flex-row items-center mt-1">
                        <Clock size={10} color="#ea580c" style={{ marginRight: 4 }} />
                        <Text className="text-orange-600 text-[9px] font-bold uppercase tracking-widest">Pending</Text>
                    </View>
                ) : (
                    <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex-row items-center mt-1">
                        <CheckCircle2 size={10} color="#10b981" style={{ marginRight: 4 }} />
                        <Text className="text-emerald-600 text-[9px] font-bold uppercase tracking-widest">Terkirim</Text>
                    </View>
                )}
            </View>

            {/* Content: Petugas Highlight & Hasil */}
            <View className="flex-col gap-3 pt-1">
                {/* HIGHLIGHT PETUGAS */}
                <View className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex-row items-center">
                    <UserCircle2 size={18} color="#3b82f6" style={{ marginRight: 8 }} />
                    <Text className="text-blue-900 text-[13.5px] font-bold flex-1">{petugas || '-'}</Text>
                </View>

                {/* HASIL VISIT */}
                <View className="flex-row items-start px-1 mt-1">
                    <SearchCheck size={14} color="#64748b" style={{ marginTop: 2 }} />
                    <View className="ml-2 flex-1">
                        <Text className="text-slate-700 text-[13px] font-bold mb-0.5">Hasil Visit:</Text>
                        <Text className="text-slate-600 text-[12px] leading-relaxed" numberOfLines={2}>{hasil || '-'}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-end mt-1">
                    <Text className="text-slate-400 text-[10px] font-bold">Waktu Visit: {formatTime(item.created_at)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
