import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Camera,
    FileText,
    Image as ImageIcon,
    Info,
    UserMinus, Users,
    UserX
} from 'lucide-react-native';
import React from 'react';
import {
    ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LaporanKejadianDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const items = useSyncStore((state) => state.items);
    const item = items.find((i) => i.id === id);

    if (!item) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Data kejadian tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-orange-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { data } = item;
    // Removed dummy data
    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Laporan</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                {/* 1. Detail Kejadian */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Detail Kejadian</Text>
                    </View>

                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Nomor Laporan</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.nomor}</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Perihal</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.perihal}</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Tempat Kejadian</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.tempat}</Text>
                    </View>

                    <View className="flex-row justify-between mb-2">
                        <View className="w-[48%]">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Tanggal</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.tanggal}</Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Pukul</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.pukul}</Text>
                        </View>
                    </View>
                </View>

                {/* 2. Identitas Korban */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <UserX color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Identitas Korban</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Nama Korban</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.korban_nama}</Text>
                    </View>
                    <View className="mb-2">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Alamat</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.korban_alamat}</Text>
                    </View>
                </View>

                {/* 3. Identitas Pelaku */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <UserMinus color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Identitas Pelaku</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Nama Pelaku</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.pelaku_nama}</Text>
                    </View>
                    <View className="mb-2">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Alamat</Text>
                        <Text className="text-[15px] text-slate-800 font-medium">{data.pelaku_alamat}</Text>
                    </View>
                </View>

                {/* 4. Saksi */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <Users color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Saksi-Saksi</Text>
                    </View>
                    <View className="flex-row flex-wrap justify-between">
                        <View className="w-[48%] mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Saksi 1</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.saksi_1}</Text>
                        </View>
                        <View className="w-[48%] mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Saksi 2</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.saksi_2}</Text>
                        </View>
                        <View className="w-[48%] mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Saksi 3</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.saksi_3}</Text>
                        </View>
                        <View className="w-[48%] mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Saksi 4</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.saksi_4}</Text>
                        </View>
                    </View>
                </View>

                {/* 5. Barang Bukti */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <Briefcase color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Barang Bukti</Text>
                    </View>
                    <View className="flex-row flex-wrap justify-between">
                        <View className="w-[48%] mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bukti 1</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.bukti_1}</Text>
                        </View>
                        <View className="w-[48%] mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bukti 2</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.bukti_2}</Text>
                        </View>
                        <View className="w-[48%] mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bukti 3</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.bukti_3}</Text>
                        </View>
                        <View className="w-[48%] mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Bukti 4</Text>
                            <Text className="text-[15px] text-slate-800 font-medium">{data.bukti_4}</Text>
                        </View>
                    </View>
                </View>

                {/* 6. Kronologis & Kerugian */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <FileText color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Kronologis & Kerugian</Text>
                    </View>
                    <View className="mb-5">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Kronologis Kejadian</Text>
                        <Text className="text-[15px] text-slate-800 font-medium leading-relaxed">{data.kronologis}</Text>
                    </View>
                    <View className="mb-2">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Potensi Kerugian</Text>
                        <Text className="text-[15px] text-red-600 font-bold">{data.kerugian}</Text>
                    </View>
                </View>

                {/* 7. Tindakan TKP */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-6">
                        <AlertTriangle color="#ea580c" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Tindakan TKP</Text>
                    </View>
                    <View className="mb-2">
                        <Text className="text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1 mb-2 uppercase tracking-wider">Tindakan Pertama</Text>
                        <Text className="text-[15px] text-slate-800 font-medium leading-relaxed">{data.tindakan}</Text>
                    </View>
                </View>

                {/* 8. Dokumentasi */}
                <View className="bg-white rounded-2xl p-5 mb-10 shadow-sm border border-slate-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Camera color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Dokumentasi</Text>
                        </View>
                        <Text className="text-[11px] font-bold text-slate-400">2 Foto</Text>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        <View className="w-[100px] h-[100px] rounded-xl bg-slate-100 border border-slate-200 items-center justify-center overflow-hidden shadow-sm">
                            <ImageIcon color="#94a3b8" size={32} />
                            <Text className="text-slate-400 font-bold text-[10px] mt-2 text-center px-2">Kabel CCTV Terputus</Text>
                        </View>

                        <View className="w-[100px] h-[100px] rounded-xl bg-slate-100 border border-slate-200 items-center justify-center overflow-hidden shadow-sm">
                            <ImageIcon color="#94a3b8" size={32} />
                            <Text className="text-slate-400 font-bold text-[10px] mt-2 text-center px-2">Barang Bukti Tang</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
