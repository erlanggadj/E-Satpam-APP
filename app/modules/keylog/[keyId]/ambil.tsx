import { syncAllPendingData } from '@/hooks/useBackgroundSync';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Image as ImageIcon, Info, Plus, UserCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AmbilKeyScreen() {
    const router = useRouter();
    const { keyId } = useLocalSearchParams<{ keyId: string }>();

    const allKeys = useModuleStore((state) => state.keys);
    const keyData = allKeys.find(k => k.id === keyId);
    const takeKey = useModuleStore(state => state.takeKey);

    const [takerName, setTakerName] = useState('');
    const [takerDivision, setTakerDivision] = useState('');
    const [keterangan, setKeterangan] = useState('');

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

    const handleSimpanAmbil = () => {
        if (!takerName) {
            Alert.alert('Error', 'Nama pengambil wajib diisi!');
            return;
        }

        takeKey(keyData.id, takerName, takerDivision, keterangan);
        syncAllPendingData();
        Alert.alert('Sukses', 'Kunci berhasil diambil, mencoba sinkronisasi...', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER */}
            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Form Ambil Kunci</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    {/* BLOK ATAS - READ ONLY PENITIPAN KUNCI */}
                    <View className="bg-slate-100/50 rounded-2xl p-5 mb-5 border border-slate-200 opacity-60">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Info color="#64748b" size={18} style={{ marginRight: 8 }} />
                                <Text className="text-slate-600 font-bold text-[13px]">Informasi Penitipan (Dikunci)</Text>
                            </View>
                        </View>
                        <View className="mb-3">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase">Nama Kunci & Penyerah</Text>
                            <Text className="text-[14px] text-slate-700 font-medium">{keyData.keyName} - ({keyData.depositorName})</Text>
                        </View>
                        <View className="mb-1">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase">Waktu Titip</Text>
                            <View className="flex-row items-center">
                                <Clock size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                                <Text className="text-[13px] text-slate-600 font-medium">{formatDateTime(keyData.depositTime)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* BLOK BAWAH - FORM PENGAMBIL */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6">
                            <UserCheck color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Informasi Pengambil</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Pengambil</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan nama pengambil" value={takerName} onChangeText={setTakerName} />
                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bagian / Divisi Pengambil</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Teknisi AC" value={takerDivision} onChangeText={setTakerDivision} />
                            </View>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keterangan Lanjut</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white min-h-[80px]">
                                <TextInput
                                    className="text-slate-800 text-[14px]"
                                    placeholder="Tujuan atau pesan..."
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    value={keterangan}
                                    onChangeText={setKeterangan}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Bukti KTP Placeholder */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <ImageIcon color="#ea580c" size={18} style={{ marginRight: 8 }} />
                                <Text className="text-slate-800 font-bold text-[15px]">Bukti KTP Pengambil</Text>
                            </View>
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity activeOpacity={0.7} className="w-[100px] h-[70px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 items-center justify-center">
                                <Plus color="#94a3b8" size={24} />
                                <Text className="text-slate-400 font-bold text-[10px] mt-1">Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-[#ea580c] py-4 rounded-xl flex-row items-center justify-center mb-10 shadow-sm active:bg-orange-600"
                        onPress={handleSimpanAmbil}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Konfirmasi Ambil Kunci</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
