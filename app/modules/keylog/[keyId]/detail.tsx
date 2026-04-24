import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Info, UserCheck, UserMinus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KeyLogDetailScreen() {
    const router = useRouter();
    const { keyId } = useLocalSearchParams<{ keyId: string }>();

    const allKeys = useModuleStore((state) => state.keys);
    const keyData = allKeys.find(k => String(k.id) === String(keyId));

    const { user } = useAuthStore();
    const [fetchedRecord, setFetchedRecord] = useState<any>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        if (!keyData && keyId) {
            setIsLoadingFetch(true);
            api.get(`/keylog/${keyId}`).then(res => {
                const data = res.data.data;
                setFetchedRecord(data);
                useModuleStore.getState().upsertRecord('keys', data);
                setIsLoadingFetch(false);
            }).catch(err => {
                console.error(err);
                setIsLoadingFetch(false);
            });
        }
    }, [keyData, keyId]);

    const activeItem = keyData || fetchedRecord;

    const source = (useLocalSearchParams() as any)?.source;
    const canApprove = source === 'history' && (user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.jabatan === 'KAPAMWIL') && (activeItem as any)?.status !== 'APPROVED';

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            await api.patch(`/history/keylog/${keyId}/approve`);
            useModuleStore.getState().approveRecord('keys', keyId as string);
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
                <Text className="text-slate-500 font-medium">Data kunci tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-orange-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const formatDateTime = (isoString?: string) => {
        if (!isoString) return '-';
        const d = new Date(isoString);
        return `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Log Kunci</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                {/* 1. Detail Titip */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Informasi Penitipan</Text>
                        </View>
                        <View className="bg-orange-50 px-2 py-1 rounded border border-orange-100">
                            <Text className="text-orange-600 text-[9px] font-bold uppercase tracking-widest">Waktu Penitipan Terkunci</Text>
                        </View>
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
                                <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Nama Kunci</Text>
                                <Text className="text-[15px] text-slate-800 font-bold">{activeItem.keyName}</Text>
                            </View>
                            <View className="mb-5">
                                <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Penyerah (Penitip)</Text>
                                <Text className="text-[15px] text-slate-800 font-medium">{activeItem.depositorName}</Text>
                            </View>
                            <View className="mb-5">
                                <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bagian/Divisi Penyerah</Text>
                                <Text className="text-[15px] text-slate-800 font-medium">{activeItem.depositorDivision}</Text>
                            </View>
                            <View className="mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Waktu Titip</Text>
                                <View className="flex-row items-center">
                                    <Clock size={14} color="#64748b" style={{ marginRight: 6 }} />
                                    <Text className="text-[15px] text-slate-800 font-medium">{formatDateTime(activeItem.depositTime)}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* 2. Detail Pengambilan (Hanya munul jika status TAKEN) */}
                {isLoadingFetch ? (
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <Skeleton width="40%" height={16} style={{ marginBottom: 15 }} />
                        <Skeleton width="100%" height={40} style={{ marginBottom: 15 }} />
                        <Skeleton width="100%" height={40} />
                    </View>
                ) : activeItem.status === 'TAKEN' ? (
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-emerald-100">
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <UserCheck color="#10b981" size={18} style={{ marginRight: 8 }} />
                                <Text className="text-slate-800 font-bold text-[15px]">Informasi Pengambilan</Text>
                            </View>
                            <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                <Text className="text-emerald-600 text-[9px] font-bold uppercase tracking-widest">Selesai</Text>
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Pengambil</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{activeItem.takerName}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bagian/Divisi Pengambil</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{activeItem.takerDivision}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Keterangan</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{activeItem.keterangan || '-'}</Text>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Waktu Ambil</Text>
                            <View className="flex-row items-center">
                                <Clock size={14} color="#64748b" style={{ marginRight: 6 }} />
                                <Text className="text-[15px] text-slate-800 font-medium">{formatDateTime(activeItem.takeTime)}</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View className="bg-slate-100 rounded-2xl p-5 mb-5 border border-slate-200 border-dashed items-center justify-center py-10">
                        <UserMinus color="#94a3b8" size={32} style={{ marginBottom: 10 }} />
                        <Text className="text-slate-400 font-medium mt-2">Kunci belum diambil.</Text>
                    </View>
                )}

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
