import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock, FileText, Info, MapPin, SearchCheck, UserSquare2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LaporanPiketDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const items = useSyncStore((state) => state.items);
    const item = items.find((i) => String(i.id) === String(id));

    const { user } = useAuthStore();
    const [fetchedRecord, setFetchedRecord] = useState<any>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        if (!item && id) {
            setIsLoadingFetch(true);
            api.get(`/piket/${id}`).then(res => {
                const data = res.data.data;
                setFetchedRecord(data);
                useSyncStore.getState().syncServerData('piket', [data]);
                setIsLoadingFetch(false);
            }).catch(err => {
                console.error(err);
                setIsLoadingFetch(false);
            });
        }
    }, [item, id]);

    const activeItem = item || (fetchedRecord ? { data: fetchedRecord, status: fetchedRecord.status, sync_status: 1, created_at: fetchedRecord.createdAt } : null);

    const source = (useLocalSearchParams() as any)?.source;
    const canApprove = source === 'history' && (user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.jabatan === 'KAPAMWIL') && (activeItem as any)?.status !== 'APPROVED';

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await api.patch(`/history/piket/${id}/approve`);
            useSyncStore.getState().approveItem(id as string, 'piket');
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
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Data laporan piket tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-orange-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { lokasi, petugas, hasil, keterangan } = activeItem?.data || {};
    const isPending = activeItem?.sync_status === 0;

    const formatDateTime = (isoString?: string) => {
        if (!isoString) return '-';
        const d = new Date(isoString);
        return `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <View className="flex-1 bg-slate-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <SafeAreaView className="bg-white border-b border-gray-100 shadow-sm z-10" edges={['top']}>
                <View className="flex flex-row items-center p-5 pt-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Riwayat Piket</Text>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                {/* STATUS BADGE */}
                <View className="flex-row justify-center mb-6">
                    {isLoadingFetch ? (
                        <Skeleton width={180} height={34} borderRadius={17} />
                    ) : isPending ? (
                        <View className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex-row items-center">
                            <Clock size={14} color="#ea580c" style={{ marginRight: 6 }} />
                            <Text className="text-orange-600 text-[11px] font-bold uppercase tracking-widest">Status: Menunggu Sinkronisasi</Text>
                        </View>
                    ) : (
                        <View className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex-row items-center">
                            <CheckCircle2 size={14} color="#10b981" style={{ marginRight: 6 }} />
                            <Text className="text-emerald-700 text-[11px] font-bold uppercase tracking-widest">Status: Terkirim</Text>
                        </View>
                    )}
                </View>

                {/* KONTEN UTAMA */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Informasi Data Visit</Text>
                    </View>

                    {isLoadingFetch ? (
                        <View>
                            {[1, 2, 3, 4].map(i => (
                                <View key={i} className="mb-4 pb-4 border-b border-slate-100 last:border-0">
                                    <Skeleton width="30%" height={12} style={{ marginBottom: 8 }} />
                                    <Skeleton width="100%" height={16} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <>
                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <MapPin size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                    <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider flex-1">Lokasi Kunjungan</Text>
                                </View>
                                <Text className="text-[15px] text-slate-800 font-bold pl-4">{lokasi}</Text>
                            </View>

                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <UserSquare2 size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                    <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider flex-1">Petugas Piket</Text>
                                </View>
                                <Text className="text-[15px] text-slate-800 font-bold pl-4">{petugas}</Text>
                            </View>

                            <View className="mb-5">
                                <View className="flex-row items-center mb-2">
                                    <SearchCheck size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                    <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider flex-1">Hasil Visit</Text>
                                </View>
                                <Text className="text-[14px] text-slate-700 leading-relaxed pl-4">{hasil}</Text>
                            </View>

                            <View className="mb-2">
                                <View className="flex-row items-center mb-2">
                                    <FileText size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                    <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider flex-1">Keterangan Khusus</Text>
                                </View>
                                <Text className="text-[14px] text-slate-500 leading-relaxed italic pl-4 bg-slate-50 p-3 rounded-lg border border-slate-100">{keterangan || 'Tidak ada keterangan tambahan.'}</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* META INFO */}
                <View className="items-center mt-2 mb-10">
                    <Text className="text-slate-400 text-[11px] font-medium">Laporan dibuat pada:</Text>
                    {activeItem?.created_at ? <Text className="text-slate-500 text-[12px] font-bold mt-1">{formatDateTime(activeItem.created_at)}</Text> : <Skeleton width={120} height={14} style={{ marginTop: 4 }} />}
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
        </View>
    );
}
