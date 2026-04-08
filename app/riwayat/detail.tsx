import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Image as ImageIcon, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailRiwayatScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row justify-between items-center px-5 pt-4 pb-5 bg-white border-b border-gray-100 shadow-sm z-10">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="text-[20px] font-bold text-slate-800 tracking-tight">Detail Laporan</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

                {/* Data Detail Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-4">Informasi Dasar</Text>

                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                            <User size={20} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-500 text-[12px] font-medium mb-0.5">Nama / ID Laporan</Text>
                            <Text className="text-slate-800 text-[15px] font-bold">LOG-0042 / Budi Santoso</Text>
                        </View>
                    </View>

                    <View className="flex-row space-x-4">
                        <View className="flex-1 flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                                <Calendar size={18} color="#f59e0b" />
                            </View>
                            <View>
                                <Text className="text-slate-500 text-[12px] font-medium mb-0.5">Tanggal</Text>
                                <Text className="text-slate-800 text-[14px] font-bold">17 Mar 2026</Text>
                            </View>
                        </View>

                        <View className="flex-1 flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                                <Clock size={18} color="#10b981" />
                            </View>
                            <View>
                                <Text className="text-slate-500 text-[12px] font-medium mb-0.5">Waktu</Text>
                                <Text className="text-slate-800 text-[14px] font-bold">14:30 WIB</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Description Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3">Deskripsi Kejadian</Text>
                    <Text className="text-slate-700 text-[14px] leading-relaxed">
                        Tamu memasuki area pabrik untuk melakukan pertemuan internal dengan direksi. Seluruh akses sudah dikonfirmasi melalui portal depan dan identitas KTP telah dititipkan kepada petugas keamanan.
                    </Text>
                </View>

                {/* Photo Placeholder */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3">Bukti Lampiran</Text>
                    <View className="h-48 bg-slate-100 rounded-xl border border-slate-200 border-dashed flex items-center justify-center">
                        <ImageIcon size={32} color="#cbd5e1" className="mb-2" />
                        <Text className="text-slate-400 font-medium text-[13px]">Foto tidak tersedia</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Fixed Bottom Actions */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-4 pb-6 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] flex-row space-x-3 gap-3">
                <TouchableOpacity
                    className="flex-1 bg-white border-2 border-red-500 py-4 rounded-xl items-center justify-center"
                    activeOpacity={0.7}
                    onPress={() => router.back()}
                >
                    <Text className="text-red-500 font-bold tracking-wide text-[14px]">TOLAK</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 bg-[#10B981] py-4 rounded-xl items-center justify-center shadow-sm"
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-bold tracking-wide text-[14px]">VALIDASI / APPROVE</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}
