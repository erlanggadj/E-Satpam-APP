import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock, FileText, Info, MapPin, SearchCheck, UserSquare2 } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LaporanPiketDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const items = useSyncStore((state) => state.items);
    const item = items.find((i) => i.id === id);

    if (!item) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Data laporan piket tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-orange-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { lokasi, petugas, hasil, keterangan } = item.data;
    const isPending = item.sync_status === 0;

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
                    {isPending ? (
                        <View className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex-row items-center">
                            <Clock size={14} color="#ea580c" style={{ marginRight: 6 }} />
                            <Text className="text-orange-600 text-[11px] font-bold uppercase tracking-widest">Status: Menunggu Sinkronisasi</Text>
                        </View>
                    ) : (
                        <View className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex-row items-center">
                            <CheckCircle2 size={14} color="#10b981" style={{ marginRight: 6 }} />
                            <Text className="text-emerald-600 text-[11px] font-bold uppercase tracking-widest">Status: Terkirim</Text>
                        </View>
                    )}
                </View>

                {/* KONTEN UTAMA */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Informasi Data Visit</Text>
                    </View>

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
                </View>

                {/* META INFO */}
                <View className="items-center mt-2 mb-10">
                    <Text className="text-slate-400 text-[11px] font-medium">Laporan dibuat pada:</Text>
                    <Text className="text-slate-500 text-[12px] font-bold mt-1">{formatDateTime(item.created_at)}</Text>
                </View>

            </ScrollView>
        </View>
    );
}
