import { SyncBadge } from '@/components/ui/SyncBadge';
import { SyncItem } from '@/store/useSyncStore';
import { useRouter } from 'expo-router';
import { Clock, FileText } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TamuCardProps {
    item: SyncItem;
}

export function TamuCard({ item }: TamuCardProps) {
    const router = useRouter();
    const isNavigating = useRef(false);

    const handlePress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/${item.moduleId}/detail?itemId=${item.id}` as any);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const title = item.data.namaTamu || item.data.nama_tamu || item.data.pos_jaga || item.data.record_name || `Log: ${item.id.substring(0, 8)}`;
    const subtitle = item.data.tujuan || item.data.catatan || item.data.detail || 'Tidak ada deskripsi rinci';

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            activeOpacity={0.7}
            onPress={handlePress}
        >
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3 border border-slate-100">
                        <FileText size={20} color="#64748b" />
                    </View>
                    <View className="flex-1 pr-4">
                        <Text className="text-slate-800 text-[15px] font-bold" numberOfLines={1}>{title}</Text>
                        <Text className="text-slate-500 text-[12px] font-medium mt-0.5">{subtitle}</Text>
                    </View>
                </View>
                <SyncBadge status={item.sync_status || 0} moduleType={(item?.moduleId?.toUpperCase() as any) || 'GENERIC'} />
            </View>

            <View className="flex-col gap-1.5 pt-3 mt-1 border-t border-slate-100">
                <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-500 text-[12px] font-medium ml-1">
                        Dibuat pada: {formatDate(item.created_at)}
                    </Text>
                </View>

            </View>
        </TouchableOpacity>
    );
}
