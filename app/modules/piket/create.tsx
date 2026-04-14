import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useRouter } from 'expo-router';
import {
    ArrowLeft,
    CheckSquare,
    Info,
    MapPin,
    UserCheck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

export default function LaporanPiketCreateScreen() {
    const router = useRouter();

    const [lokasi, setLokasi] = useState('');
    const [petugas, setPetugas] = useState('');
    const [hasil, setHasil] = useState('');
    const [keterangan, setKeterangan] = useState('');

    const addItem = useSyncStore((state) => state.addItem);

    const handleSubmit = () => {
        if (!lokasi || !petugas || !hasil) {
            Alert.alert('Data Belum Lengkap', 'Lokasi, Nama Petugas, dan Hasil Visit wajib diisi!');
            return;
        }

        addItem({
            id: uuidv4(),
            moduleId: 'piket',
            data: { lokasi, petugas, hasil, keterangan },
            sync_status: 0, // 0 = Pending/Offline menunggu sinkronisasi
            created_at: new Date().toISOString()
        });

        Alert.alert('Sukses', 'Laporan Piket Staff berhasil tersimpan!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Form Piket Staff</Text>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    {/* Form Piket */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6">
                            <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Informasi Pendataan Piket</Text>
                        </View>

                        <View className="mb-4">
                            <View className="flex-row items-center mb-2">
                                <MapPin size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lokasi / Area Kunjungan</Text>
                            </View>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Pos Utama, Area Produksi..." value={lokasi} onChangeText={setLokasi} />
                            </View>
                        </View>

                        <View className="mb-4">
                            <View className="flex-row items-center mb-2">
                                <UserCheck size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama Petugas Piket</Text>
                            </View>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan nama" value={petugas} onChangeText={setPetugas} />
                            </View>
                        </View>

                        <View className="mb-4">
                            <View className="flex-row items-center mb-2">
                                <CheckSquare size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hasil Visit</Text>
                            </View>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Keterangan singkat hasil kontrol..." value={hasil} onChangeText={setHasil} />
                            </View>
                        </View>

                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Keterangan Lanjut</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white min-h-[100px]">
                                <TextInput
                                    className="text-slate-800 text-[14px]"
                                    placeholder="Jelaskan temuan spesifik (opsional)"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={keterangan}
                                    onChangeText={setKeterangan}
                                />
                            </View>
                        </View>
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        className="bg-[#ea580c] py-4 rounded-xl flex-row items-center justify-center mb-10 shadow-sm active:bg-orange-600"
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Submit Piket</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
