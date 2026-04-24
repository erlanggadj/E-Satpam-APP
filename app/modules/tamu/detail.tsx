import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock, FileText } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GenericModuleDetailScreen() {
    const router = useRouter();
    const { itemId } = useLocalSearchParams();
    const id = 'tamu'; // Ex-Generic Route Fallback
    const items = useSyncStore(state => state.items);

    const record = items.find((i: any) => String(i.id) === String(itemId));
    const { user } = useAuthStore();
    const [fetchedRecord, setFetchedRecord] = useState<any>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        if (!record && itemId && itemId !== 'undefined') {
            setIsLoadingFetch(true);
            api.get(`/tamu/${itemId}`).then(res => {
                const data = res.data.data;
                setFetchedRecord(data);
                useSyncStore.getState().syncServerData('tamu', [data]);
                setIsLoadingFetch(false);
            }).catch(err => {
                console.error(err);
                setIsLoadingFetch(false);
            });
        }
    }, [record, itemId]);

    const activeItem = record || (fetchedRecord ? {
        id: fetchedRecord.id,
        created_at: fetchedRecord.createdAt,
        sync_status: 1,
        status: fetchedRecord.status,
        data: Object.fromEntries(
            Object.entries(fetchedRecord).filter(([k]) => !['id', 'status', 'createdAt', 'updatedAt', 'createdBy'].includes(k))
        )
    } : null);

    const source = (useLocalSearchParams() as any)?.source;
    const canApprove = source === 'history' && (user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.jabatan === 'KAPAMWIL') && (activeItem as any)?.status !== 'APPROVED';

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await api.patch(`/history/tamu/${itemId}/approve`);
            useSyncStore.getState().approveItem(itemId as string, 'tamu');
            // @ts-ignore
            if (typeof global !== 'undefined' && global.alert) global.alert('Laporan berhasil divalidasi');
            router.back();
        } catch (error) {
            console.error('Failed to validate', error);
        } finally {
            setIsApproving(false);
        }
    };

    // Remove early loading return to keep header visible

    if (!activeItem && !isLoadingFetch) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 flex-col items-center justify-center">
                <Text className="text-gray-500 font-bold mb-4">Catatan tidak ditemukan!</Text>
                <TouchableOpacity className="bg-[#ea580c] px-6 py-2 rounded-lg cursor-pointer" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const formatDate = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    // Construct array of mapped values safely
    const details = Object.entries(activeItem?.data || {}).filter(([key, value]) => value !== '' && key !== 'id' && value !== null);

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Log ({id})</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6 pb-20" showsVerticalScrollIndicator={false}>

                {/* Meta Overview */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-3">
                                <FileText size={18} color="#ea580c" />
                            </View>
                            <View>
                                <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{id}</Text>
                                {activeItem?.id ? <Text className="text-slate-800 font-bold text-[14px]">ID: {activeItem.id.slice(0, 8)}</Text> : <Skeleton width={100} height={14} style={{ marginTop: 4 }} />}
                            </View>
                        </View>
                        <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            <Text className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Tersimpan</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-2">
                        <Clock size={16} color="#94a3b8" style={{ marginRight: 10 }} />
                        {activeItem?.created_at ? <Text className="text-slate-600 text-[13px]">{formatDate(activeItem.created_at)}</Text> : <Skeleton width={120} height={14} />}
                    </View>

                    <View className="flex-row items-center">
                        <CheckCircle2 size={16} color="#10b981" style={{ marginRight: 10 }} />
                        {activeItem?.sync_status !== undefined ? (
                            <Text className="text-slate-600 text-[13px]">Status Sinkronisasi : {activeItem.sync_status === 1 ? 'Sudah Dikirim' : 'Pending'}</Text>
                        ) : <Skeleton width={150} height={14} />}
                    </View>
                </View>

                {/* Attributes map */}
                <Text className="text-[13px] font-bold text-slate-800 tracking-tight mb-3 ml-1">DATA TERCATAT</Text>

                <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-slate-100">
                    {isLoadingFetch ? (
                        <View>
                            {[1, 2, 3, 4].map(i => (
                                <View key={i} className="mb-4 pb-4 border-b border-slate-100 last:border-0">
                                    <Skeleton width="30%" height={12} style={{ marginBottom: 8 }} />
                                    <Skeleton width="100%" height={16} />
                                </View>
                            ))}
                        </View>
                    ) : details.length === 0 ? (

                        <Text className="text-slate-400 italic">Formulir kosong tanpa input.</Text>
                    ) : (
                        details.map(([key, value], idx) => {
                            const isLast = idx === details.length - 1;
                            const title = key.replace(/_/g, ' ');
                            return (
                                <View key={key} className={`mb-4 ${!isLast ? 'pb-4 border-b border-slate-100' : ''}`}>
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 capitalize">
                                        {title}
                                    </Text>
                                    <Text className="text-slate-800 text-[14px] leading-relaxed">
                                        {value as string}
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </View>

            </ScrollView>

            {/* Approval Button for KAPAMWIL */}
            {canApprove && (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-4 pb-6 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
                    <TouchableOpacity
                        className={`w-full ${isApproving ? 'bg-emerald-300' : 'bg-orange-500'} py-4 rounded-xl items-center justify-center shadow-sm`}
                        onPress={handleApprove}
                        disabled={isApproving}
                    >
                        <Text className="text-white font-bold tracking-wide text-[14px]">
                            {isApproving ? 'MEMPROSES...' : 'VALIDASI / APPROVE'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
