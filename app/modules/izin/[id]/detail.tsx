import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Clock, Info, LogIn, LogOut, MapPin, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IzinDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const izin = useModuleStore((state) => state.izins.find(i => i.id === id));

    if (!izin) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Data izin tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-sky-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
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

    const isBusiness = izin.reasonType === 'Kerja';

    return (
        <View className="flex-1 bg-slate-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <SafeAreaView className="bg-white border-b border-gray-100 shadow-sm z-10" edges={['top']}>
                <View className="flex flex-row items-center p-5 pt-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Izin Karyawan</Text>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                {/* STATUS BADGE */}
                <View className="flex-row justify-center mb-6">
                    {izin.status === 'OUT' ? (
                        <View className="bg-amber-50 px-4 py-2 rounded-full border border-amber-100 flex-row items-center shadow-sm">
                            <Clock size={14} color="#d97706" style={{ marginRight: 6 }} />
                            <Text className="text-amber-600 text-[11px] font-bold uppercase tracking-widest">Status Saat ini: DI LUAR PABRIK</Text>
                        </View>
                    ) : (
                        <View className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex-row items-center shadow-sm">
                            <CheckCircle2 size={14} color="#10b981" style={{ marginRight: 6 }} />
                            <Text className="text-emerald-600 text-[11px] font-bold uppercase tracking-widest">Selesai: SUDAH MASUK KEMBALI</Text>
                        </View>
                    )}
                </View>

                {/* HEAD INFO */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100 items-center text-center">
                    <View className={`w-16 h-16 ${isBusiness ? 'bg-blue-50' : 'bg-pink-50'} rounded-full flex items-center justify-center mb-3`}>
                        {isBusiness ? <BriefcaseBusiness size={32} color="#2563eb" /> : <User size={32} color="#db2777" />}
                    </View>
                    <Text className="text-slate-800 font-bold text-[20px] mb-1">{izin.name}</Text>
                    <View className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        <Text className="text-slate-600 text-[12px] font-bold">{izin.department}</Text>
                    </View>
                </View>

                {/* DETAIL INFO */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-5 pb-3 border-b border-slate-50">
                        <MapPin color="#0ea5e9" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px] flex-1">Tujuan & Keperluan</Text>
                    </View>

                    <View className="flex-row flex-wrap mb-4">
                        <View className="w-1/2 mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jenis Alasan</Text>
                            <Text className={`text-[14px] font-bold ${isBusiness ? 'text-blue-600' : 'text-pink-600'}`}>{izin.reasonType}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Lokasi / Instansi</Text>
                            <Text className="text-[14px] text-slate-800 font-bold">{izin.destination}</Text>
                        </View>
                        <View className="w-full">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rincian Keterangan</Text>
                            <View className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <Text className="text-[13px] text-slate-700 leading-relaxed font-medium">{izin.note}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* TIMESTAMPS */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-5 pb-3 border-b border-slate-50">
                        <Info color="#0f172a" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Rekaman Waktu</Text>
                    </View>

                    <View className="flex-row items-start mb-6 relative">
                        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4 border border-slate-200">
                            <LogOut size={20} color="#f59e0b" />
                        </View>
                        <View className="flex-1 justify-center min-h-[40px]">
                            <Text className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-1">Pencatatan Keluar</Text>
                            <Text className="text-[13px] text-slate-700 font-bold">{formatDateTime(izin.timeOut)}</Text>
                        </View>
                        <View className="absolute left-5 top-[44px] h-[34px] w-[2px] bg-slate-200" />
                    </View>

                    <View className="flex-row items-start">
                        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4 border border-slate-200">
                            <LogIn size={20} color="#10b981" />
                        </View>
                        <View className="flex-1 justify-center min-h-[40px]">
                            <Text className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Konfirmasi Masuk (Kembali)</Text>
                            {izin.status === 'RETURNED' ? (
                                <Text className="text-[13px] text-slate-700 font-bold">{formatDateTime(izin.timeIn)}</Text>
                            ) : (
                                <Text className="text-[12px] text-slate-400 font-medium italic">Karyawan masih di luar pabrik saat ini...</Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
