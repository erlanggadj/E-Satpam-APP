import { api } from '@/config/api';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, BadgeCheck, Info, PackageOpen } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AfkirCreateScreen() {
    const router = useRouter();
    const checkinAfkir = useModuleStore((state) => state.checkinAfkir);

    const [plateNumber, setPlateNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverId, setDriverId] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [itemType, setItemType] = useState('');
    const [total, setTotal] = useState('');
    const [buyer, setBuyer] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [identityNote, setIdentityNote] = useState('');

    const handleSubmit = async () => {
        if (!plateNumber || !driverName || !driverId || !vehicleType || !itemType || !total || !buyer || !approvedBy || !identityNote) {
            Alert.alert('Data Belum Lengkap', 'Seluruh field data registrasi penarikan afkir wajib diisi!');
            return;
        }

        // 1. Save locally
        checkinAfkir(plateNumber, driverName, driverId, vehicleType, itemType, total, buyer, approvedBy, identityNote);

        // 2. Navigate back IMMEDIATELY
        router.back();

        // 3. POST in background
        try {
            await api.post('/afkir', { plateNumber, driverName, driverId, vehicleType, itemType, total, buyer, approvedBy, identityNote });
            console.log('[Afkir] ✅ Synced');
        } catch (err) {
            console.warn('[Afkir] ❌ Offline:', err);
        }
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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Data Masuk Afkir/Scrap</Text>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6 border-b border-slate-100 pb-4">
                            <Info color="#4f46e5" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Informasi Detail Pengangkut</Text>
                        </View>

                        {/* Input Fields */}
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">No. Polisi Kendaraan</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px] font-bold" placeholder="Misal: D 4014 CC" value={plateNumber} onChangeText={setPlateNumber} autoCapitalize="characters" />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Driver</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan nama pengemudi" value={driverName} onChangeText={setDriverName} />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">No. Identitas (KTP/SIM)</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: 320101XXXXXXXXX" value={driverId} onChangeText={setDriverId} keyboardType="numeric" />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis/Merek Kendaraan</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Pickup, Engkel..." value={vehicleType} onChangeText={setVehicleType} />
                            </View>
                        </View>

                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keterangan Identitas</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white min-h-[80px]">
                                <TextInput
                                    className="text-slate-800 text-[14px]"
                                    placeholder="E.g KTP Asli ditahan di pos"
                                    value={identityNote}
                                    onChangeText={setIdentityNote}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </View>

                    {/* SECTION BARANG */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6 border-b border-slate-100 pb-4">
                            <PackageOpen color="#4f46e5" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Informasi Material / Barang</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis Barang</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Besi Bekas, Plastik..." value={itemType} onChangeText={setItemType} />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jumlah</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="E.g 15 Karung / 100 Kg" value={total} onChangeText={setTotal} />
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pembeli Afkir</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Pengepul PT ABC" value={buyer} onChangeText={setBuyer} />
                            </View>
                        </View>

                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-2">Disetujui Oleh (Otorisasi)</Text>
                            <View className="border border-indigo-200 bg-indigo-50 rounded-xl px-4 py-3 shadow-sm border-b-2 border-b-indigo-300">
                                <View className="flex-row items-center">
                                    <BadgeCheck color="#4f46e5" size={16} style={{ marginRight: 8 }} />
                                    <TextInput
                                        className="text-slate-800 text-[14px] font-bold flex-1"
                                        placeholder="Nama Pejabat/PIC..."
                                        value={approvedBy}
                                        onChangeText={setApprovedBy}
                                    />
                                </View>
                            </View>
                        </View>

                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        className="bg-[#4f46e5] py-4 rounded-xl flex-row items-center justify-center mt-2 mb-10 shadow-sm active:bg-indigo-600"
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Submit Register Afkir</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
