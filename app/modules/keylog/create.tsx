import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Image as ImageIcon, Info, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DepositKeyScreen() {
    const router = useRouter();
    const depositKey = useModuleStore(state => state.depositKey);

    const [keyName, setKeyName] = useState('');
    const [depositorName, setDepositorName] = useState('');
    const [depositorDivision, setDepositorDivision] = useState('');

    const handleSimpan = () => {
        if (!keyName || !depositorName) {
            Alert.alert('Error', 'Nama kunci dan nama penyerah wajib diisi!');
            return;
        }

        depositKey(keyName, depositorName, depositorDivision);
        Alert.alert('Sukses', 'Kunci berhasil dititipkan!', [
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
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Form Penitipan Kunci</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    {/* Data Kunci & Penitip */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6">
                            <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Informasi Kunci</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Kunci</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Kunci Gudang A" value={keyName} onChangeText={setKeyName} />
                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Penyerah</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Nama yang menitipkan" value={depositorName} onChangeText={setDepositorName} />
                            </View>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bagian / Divisi Penyerah</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Bagian pekerja (opsional)" value={depositorDivision} onChangeText={setDepositorDivision} />
                            </View>
                        </View>
                    </View>

                    {/* Bukti KTP Placeholder */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <ImageIcon color="#ea580c" size={18} style={{ marginRight: 8 }} />
                                <Text className="text-slate-800 font-bold text-[15px]">Bukti KTP (Placeholder)</Text>
                            </View>
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity activeOpacity={0.7} className="w-[100px] h-[70px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 items-center justify-center">
                                <Plus color="#94a3b8" size={24} />
                                <Text className="text-slate-400 font-bold text-[10px] mt-1">Camera</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[11px] text-slate-400 italic mt-3">*Fitur upload dinonaktifkan sementara.</Text>
                    </View>

                    <TouchableOpacity
                        className="bg-[#ea580c] py-4 rounded-xl flex-row items-center justify-center mb-10 shadow-sm active:bg-orange-600"
                        onPress={handleSimpan}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Simpan</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
