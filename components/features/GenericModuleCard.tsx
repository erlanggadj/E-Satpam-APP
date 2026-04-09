import { SyncItem, useSyncStore } from '@/store/useSyncStore';
import { CheckCircle2, Clock, FileText, Send } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface GenericModuleCardProps {
    item: SyncItem;
    onAfterSubmit?: () => void;
}

export function GenericModuleCard({ item, onAfterSubmit }: GenericModuleCardProps) {
    const markItemAsSynced = useSyncStore(state => state.markItemAsSynced);

    const handleSubmit = () => {
        setTimeout(() => {
            markItemAsSynced(item.id);
            if (onAfterSubmit) onAfterSubmit();
        }, 300);
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    const title = item.data.nama_tamu || item.data.pos_jaga || item.data.record_name || `Log: ${item.id.substring(0, 8)}`;
    const subtitle = item.data.tujuan || item.data.catatan || item.data.detail || 'Tidak ada deskripsi rinci';

    const isPending = item.sync_status === 0;

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
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
                {!isPending ? (
                    <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        <Text className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Disubmit</Text>
                    </View>
                ) : (
                    <View className="bg-orange-50 px-2 py-1 rounded border border-orange-100">
                        <Text className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">Pending</Text>
                    </View>
                )}
            </View>

            <View className="flex-col gap-1.5 mb-1 pt-3 mt-1 border-t border-slate-100">
                <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-500 text-[12px] font-medium ml-1">
                        Dibuat pada: {formatDate(item.created_at)}
                    </Text>
                </View>

                {!isPending ? (
                    <View className="flex-row items-center mt-1">
                        <CheckCircle2 size={12} color="#10b981" />
                        <Text className="text-emerald-600 text-[12px] font-medium ml-1">
                            Tersinkronisasi & Dikirim
                        </Text>
                    </View>
                ) : null}
            </View>

            {isPending ? (
                <View className="flex-row space-x-3 gap-3 pt-3 mt-1 border-t border-slate-100">
                    <TouchableOpacity
                        className="flex-1 bg-[#ea580c] py-2.5 rounded-xl flex-row items-center justify-center shadow-sm active:bg-orange-600"
                        activeOpacity={0.7}
                        onPress={handleSubmit}
                    >
                        <Send size={16} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text className="text-white font-bold text-[13px] uppercase tracking-wide">Kirim Data</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
}
