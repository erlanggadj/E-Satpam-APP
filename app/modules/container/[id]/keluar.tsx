import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Box } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContainerKeluarScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const containerData = useModuleStore((state) => state.containers.find(c => c.id === id));
    const checkoutContainer = useModuleStore((state) => state.checkoutContainer);

    const [containerOut, setContainerOut] = useState('');

    if (!containerData) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Data kontainer tidak ditemukan.</Text>
            </SafeAreaView>
        );
    }

    const handleSubmit = () => {
        if (!containerOut) {
            Alert.alert('Error', 'Nomor Kontainer Keluar (Out Box) wajib diisi!');
            return;
        }

        checkoutContainer(containerData.id, containerOut);
        Alert.alert('Sukses', 'Kontainer berhasil tercatat keluar!', [
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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Kendaraan Keluar</Text>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    {/* DETAIL READONLY */}
                    <View className="bg-slate-100 rounded-2xl p-5 mb-5 border border-slate-200 border-dashed">
                        <Text className="text-slate-500 text-[11px] font-bold mb-1 uppercase tracking-widest">Informasi Kendaraan Induk</Text>
                        <Text className="text-slate-800 text-[15px] font-bold">{containerData.plateNumber} • {containerData.driverName}</Text>
                        <Text className="text-slate-600 text-[13px] mt-1">Membawa masuk box: <Text className="font-bold">{containerData.containerIn}</Text></Text>
                    </View>

                    {/* FORM */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6 pb-4 border-b border-slate-50">
                            <Box color="#ea580c" size={20} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Data Kontainer Keluar / Ditarik</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">No. Box Kontainer OUT</Text>
                            <View className="border border-slate-300 bg-white rounded-xl px-4 py-3 shadow-sm border-b-2 border-b-slate-400 focus:border-orange-500 focus:border-b-orange-600">
                                <TextInput
                                    className="text-slate-800 text-[16px] font-bold tracking-widest"
                                    placeholder="Input No Box Dibawa Keluar"
                                    value={containerOut}
                                    onChangeText={setContainerOut}
                                    autoCapitalize="characters"
                                    autoFocus
                                />
                            </View>
                            <Text className="text-[10px] text-slate-400 mt-2 ml-1 italic">*Pastikan nomor terdata sesuai dengan badan container.</Text>
                        </View>
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        className="bg-[#10b981] py-4 rounded-xl flex-row items-center justify-center mb-10 shadow-sm active:bg-emerald-600 mt-4"
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Konfirmasi Gerbang Keluar</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
