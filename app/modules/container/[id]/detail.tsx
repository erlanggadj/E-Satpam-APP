import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, Clock, Info, Truck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContainerDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const container = useModuleStore((state) => state.containers.find(c => c.id === id));

    if (!container) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Data kontainer tidak ditemukan.</Text>
                <TouchableOpacity className="mt-4 bg-orange-500 px-6 py-2 rounded-lg" onPress={() => router.back()}>
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isPending = container.status === 'IN';

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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Detail Log Kontainer</Text>
                </View>
            </SafeAreaView>

            <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                {/* STATUS BADGE */}
                <View className="flex-row justify-center mb-6">
                    {isPending ? (
                        <View className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex-row items-center shadow-sm">
                            <Clock size={14} color="#ea580c" style={{ marginRight: 6 }} />
                            <Text className="text-orange-600 text-[11px] font-bold uppercase tracking-widest">Saat Ini: DI AREA (IN)</Text>
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
                        <Text className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{container.plateNumber}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pengemudi</Text>
                        <Text className="text-[15px] text-slate-800 font-bold">{container.driverName}</Text>
                        <Text className="text-[12px] text-slate-500 font-semibold mt-0.5 mb-2">KTP/SIM: {container.driverId}</Text>

                        <View className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <Text className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Catatan Identitas</Text>
                            <Text className="text-[13px] text-slate-600 font-medium italic">{container.identityNote}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-start">
                        <View className="flex-1">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jenis/Tipe Kendaraan</Text>
                            <Text className="text-[14px] text-slate-800 font-semibold">{container.vehicleType}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Informasi Muatan</Text>
                            <Text className="text-[14px] text-slate-800 font-semibold">{container.cargo} ({container.total})</Text>
                        </View>
                    </View>
                </View>

                {/* SECTION: CONTINER BOXES (IN VS OUT) */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                    <View className="flex-row items-center mb-5 pb-3 border-b border-slate-50">
                        <Info color="#0f172a" size={18} style={{ marginRight: 8 }} />
                        <Text className="text-slate-800 font-bold text-[15px]">Aktivitas Bongkar / Muat</Text>
                    </View>

                    {/* ENTRY (IN) */}
                    <View className="flex-row items-start mb-6 relative">
                        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4 border border-slate-200">
                            <ArrowDown size={20} color="#ea580c" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-1">Data Masuk</Text>
                            <Text className="text-[17px] text-slate-800 font-bold tracking-widest">{container.containerIn}</Text>
                            <Text className="text-[12px] text-slate-500 font-semibold mt-1">{formatDateTime(container.checkInTime)}</Text>
                        </View>

                        {/* Connecting Line */}
                        <View className="absolute left-5 top-[44px] h-[34px] w-[2px] bg-slate-200" />
                    </View>

                    {/* EXIT (OUT) */}
                    <View className="flex-row items-start">
                        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4 border border-slate-200">
                            <ArrowUp size={20} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Data Keluar (Penarikan)</Text>
                            {container.status === 'OUT' ? (
                                <>
                                    <Text className="text-[17px] text-slate-800 font-bold tracking-widest">{container.containerOut}</Text>
                                    <Text className="text-[12px] text-slate-500 font-semibold mt-1">{formatDateTime(container.checkOutTime)}</Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-[13px] text-slate-400 font-medium italic mt-1">Kendaraan saat ini masih di dalam area pabrik. Data penarikan menanti...</Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
