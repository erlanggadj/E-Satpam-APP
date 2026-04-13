import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Info, UserCheck, UserMinus } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KeyLogDetailScreen() {
    const router = useRouter();
    const { keyId } = useLocalSearchParams<{ keyId: string }>();

    const allKeys = useModuleStore((state) => state.keys);
    const keyData = allKeys.find(k => k.id === keyId);

    if (!keyData) {
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

                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Nama Kunci</Text>
                        <Text className="text-[15px] text-slate-800 font-bold">{keyData.keyName}</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Penyerah (Penitip)</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{keyData.depositorName}</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bagian/Divisi Penyerah</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{keyData.depositorDivision}</Text>
                    </View>
                    <View className="mb-2">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Waktu Titip</Text>
                        <View className="flex-row items-center">
                            <Clock size={14} color="#64748b" style={{ marginRight: 6 }} />
                            <Text className="text-[15px] text-slate-800 font-medium">{formatDateTime(keyData.depositTime)}</Text>
                        </View>
                    </View>
                </View>

                {/* 2. Detail Pengambilan (Hanya munul jika status TAKEN) */}
                {keyData.status === 'TAKEN' ? (
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
                            <Text className="text-[15px] text-slate-800 font-medium">{keyData.takerName}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bagian/Divisi Pengambil</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{keyData.takerDivision}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Keterangan</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{keyData.keterangan || '-'}</Text>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Waktu Ambil</Text>
                            <View className="flex-row items-center">
                                <Clock size={14} color="#64748b" style={{ marginRight: 6 }} />
                                <Text className="text-[15px] text-slate-800 font-medium">{formatDateTime(keyData.takeTime)}</Text>
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
        </SafeAreaView>
    );
}
