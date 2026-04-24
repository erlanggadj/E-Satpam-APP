import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDown, ArrowLeft, ArrowUp, BadgeCheck, CheckCircle2, Clock, Info, PackageOpen, Truck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AfkirDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const afkir = useModuleStore((state) => state.afkirs.find(a => String(a.id) === String(id)));

    const { user } = useAuthStore();
    const [fetchedRecord, setFetchedRecord] = useState<any>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        if (!afkir && id) {
            setIsLoadingFetch(true);
            api.get(`/afkir/${id}`).then(res => {
                const data = res.data.data;
                setFetchedRecord(data);
                useModuleStore.getState().upsertRecord('afkirs', data);
                setIsLoadingFetch(false);
            }).catch(err => {
                console.error(err);
                setIsLoadingFetch(false);
            });
        }
    }, [afkir, id]);

    const activeItem = afkir || fetchedRecord;

    const source = (useLocalSearchParams() as any)?.source;
    const canApprove = source === 'history' && (user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.jabatan === 'KAPAMWIL') && (activeItem as any)?.status !== 'APPROVED' && activeItem?.status !== 'IN';

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await api.patch(`/history/afkir/${id}/approve`);
            useModuleStore.getState().approveRecord('afkirs', id as string);
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
                <Text className="text-slate-500 font-medium">Data barang afkir tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-indigo-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isPending = activeItem?.status === 'IN';

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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Log Afkir</Text>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                {/* STATUS BADGE */}
                <View className="flex-row justify-center mb-6">
                    {isLoadingFetch ? (
                        <Skeleton width={180} height={34} borderRadius={17} />
                    ) : isPending ? (
                        <View className="bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex-row items-center shadow-sm">
                            <Clock size={14} color="#4f46e5" style={{ marginRight: 6 }} />
                            <Text className="text-indigo-600 text-[11px] font-bold uppercase tracking-widest">Penimbangan: DI AREA (IN)</Text>
                        </View>
                    ) : (
                        <View className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex-row items-center shadow-sm">
                            <CheckCircle2 size={14} color="#10b981" style={{ marginRight: 6 }} />
                            <Text className="text-emerald-600 text-[11px] font-bold uppercase tracking-widest">Selesai: KELUAR AREA (OUT)</Text>
                        </View>
                    )}
                </View>

                {/* SECTION: DRIVER & VEHICLE */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-5 pb-3 border-b border-slate-50">
                        <Truck color="#3b82f6" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px] flex-1">Identitas Kendaraan</Text>
                        {!isLoadingFetch && <Text className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{activeItem.plateNumber}</Text>}
                    </View>

                    {isLoadingFetch ? (
                        <View>
                            <Skeleton width="30%" height={12} style={{ marginBottom: 8 }} />
                            <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
                            <Skeleton width="40%" height={12} style={{ marginBottom: 15 }} />
                            <View className="bg-slate-50 p-3 rounded-lg">
                                <Skeleton width="100%" height={30} />
                            </View>
                        </View>
                    ) : (
                        <>
                            <View className="mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pengemudi</Text>
                                <Text className="text-[15px] text-slate-800 font-bold">{activeItem.driverName}</Text>
                                <Text className="text-[12px] text-slate-500 font-semibold mt-0.5 mb-2">KTP/SIM: {activeItem.driverId}</Text>

                                <View className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    <Text className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Catatan Identitas</Text>
                                    <Text className="text-[13px] text-slate-600 font-medium italic">{activeItem.identityNote}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start">
                                <View className="flex-1">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jenis/Tipe Kendaraan</Text>
                                    <Text className="text-[14px] text-slate-800 font-semibold">{activeItem.vehicleType}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* SECTION: BARANG / MATERIAL */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-5 pb-3 border-b border-slate-50">
                        <PackageOpen color="#0f172a" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Informasi Material Afkir</Text>
                    </View>

                    {isLoadingFetch ? (
                        <View>
                            <View className="flex-row flex-wrap">
                                <View className="w-1/2 mb-4">
                                    <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
                                    <Skeleton width="80%" height={16} />
                                </View>
                                <View className="w-1/2 mb-4">
                                    <Skeleton width="40%" height={12} style={{ marginBottom: 8 }} />
                                    <Skeleton width="80%" height={16} />
                                </View>
                            </View>
                            <Skeleton width="100%" height={40} borderRadius={8} />
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap mb-4">
                            <View className="w-1/2 mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jenis Material</Text>
                                <Text className="text-[14px] text-slate-800 font-semibold">{activeItem.itemType}</Text>
                            </View>
                            <View className="w-1/2 mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jumlah / Berat</Text>
                                <Text className="text-[14px] text-slate-800 font-semibold">{activeItem.total}</Text>
                            </View>
                            <View className="w-1/2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tujuan / Pembeli</Text>
                                <Text className="text-[14px] text-slate-800 font-semibold">{activeItem.buyer}</Text>
                            </View>
                            <View className="w-1/2 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 flex-row items-center mr-2 -mt-1 ml-1 justify-center">
                                <BadgeCheck color="#4f46e5" size={18} style={{ marginRight: 6 }} />
                                <View className="flex-1 pl-1">
                                    <Text className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Disetujui Oleh</Text>
                                    <Text className="text-[13px] text-indigo-900 font-bold leading-tight" numberOfLines={1}>{activeItem.approvedBy}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* TIMESTAMPS */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-5 pb-3 border-b border-slate-50">
                        <Info color="#0f172a" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Rekaman Waktu</Text>
                    </View>

                    {isLoadingFetch ? (
                        <View>
                            <View className="flex-row items-start mb-6">
                                <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 15 }} />
                                <View className="flex-1">
                                    <Skeleton width="40%" height={12} style={{ marginBottom: 6 }} />
                                    <Skeleton width="60%" height={14} />
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 15 }} />
                                <View className="flex-1">
                                    <Skeleton width="40%" height={12} style={{ marginBottom: 6 }} />
                                    <Skeleton width="60%" height={14} />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <>
                            <View className="flex-row items-start mb-6 relative">
                                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4 border border-slate-200">
                                    <ArrowDown size={20} color="#4f46e5" />
                                </View>
                                <View className="flex-1 justify-center min-h-[40px]">
                                    <Text className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Masuk Area</Text>
                                    <Text className="text-[13px] text-slate-700 font-bold">{formatDateTime(activeItem.checkInTime)}</Text>
                                </View>
                                <View className="absolute left-5 top-[44px] h-[34px] w-[2px] bg-slate-200" />
                            </View>

                            <View className="flex-row items-start">
                                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4 border border-slate-200">
                                    <ArrowUp size={20} color="#10b981" />
                                </View>
                                <View className="flex-1 justify-center min-h-[40px]">
                                    <Text className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Pengangkutan Selesai</Text>
                                    {activeItem.status === 'OUT' || activeItem.status === 'APPROVED' ? (
                                        <Text className="text-[13px] text-slate-700 font-bold">{formatDateTime(activeItem.checkOutTime)}</Text>
                                    ) : (
                                        <Text className="text-[12px] text-slate-400 font-medium italic">Sedang dalam proses bongkar muat...</Text>
                                    )}
                                </View>
                            </View>
                        </>
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
        </View>
    );
}
