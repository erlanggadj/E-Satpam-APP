import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera, CheckCircle, Key } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KeyCheckoutScreen() {
    const { keyId } = useLocalSearchParams<{ keyId: string }>();
    const router = useRouter();

    const { keys, takeKey } = useModuleStore();
    const keyRecord = keys.find(k => k.id === keyId);

    const [takerName, setTakerName] = useState('');
    const [division, setDivision] = useState('');
    const [photoCaptured, setPhotoCaptured] = useState(false);

    if (!keyRecord || keyRecord.status === 'TAKEN') {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <Text className="text-slate-500 font-medium">Kunci tidak ditemukan atau sudah diambil.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg">
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleSubmit = () => {
        if (!takerName.trim() || !division.trim()) {
            Alert.alert('Form Tidak Lengkap', 'Nama Pengambil dan Divisi wajib diisi.');
            return;
        }

        if (!photoCaptured) {
            Alert.alert('Foto Wajib', 'Mohon ambil foto bukti pengambilan kunci terlebih dahulu.');
            return;
        }

        // Process taking the key
        takeKey(keyRecord.id, takerName, division, new Date().toISOString());

        // Return to module index
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex flex-row items-center p-5 border-b border-gray-200 bg-white z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="flex-1 text-[20px] font-bold text-slate-900 tracking-tight">Ambil Kunci</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Key Info Summary */}
                    <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex-row items-center">
                        <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
                            <Key size={22} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-500 text-[12px] font-medium uppercase tracking-widest mb-0.5">TARGET KUNCI</Text>
                            <Text className="text-slate-800 text-[16px] font-bold">{keyRecord.keyName}</Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <Text className="text-slate-800 text-[18px] font-bold mb-4 tracking-tight">Data Peminjam</Text>

                    <View className="mb-4">
                        <Text className="text-slate-500 text-[13px] font-medium mb-1.5 ml-1">Nama Pengambil *</Text>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-[15px] text-slate-800 flex-1 shadow-sm"
                            placeholder="Contoh: Budi Santoso"
                            value={takerName}
                            onChangeText={setTakerName}
                            style={{ elevation: 1 }}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-slate-500 text-[13px] font-medium mb-1.5 ml-1">Divisi / Vendor *</Text>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-[15px] text-slate-800 flex-1 shadow-sm"
                            placeholder="Contoh: Vendor AC / Maintenance"
                            value={division}
                            onChangeText={setDivision}
                            style={{ elevation: 1 }}
                        />
                    </View>

                    {/* Photo Proof Section */}
                    <Text className="text-slate-800 text-[18px] font-bold mb-4 tracking-tight">Bukti Pengambilan</Text>

                    <TouchableOpacity
                        className={`border-2 border-dashed h-40 rounded-2xl flex items-center justify-center bg-white mb-8 ${photoCaptured ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300'}`}
                        activeOpacity={0.7}
                        onPress={() => setPhotoCaptured(!photoCaptured)}
                    >
                        {photoCaptured ? (
                            <>
                                <View className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle size={28} color="#10B981" />
                                </View>
                                <Text className="text-emerald-700 font-bold text-[15px]">Foto Tersimpan</Text>
                                <Text className="text-emerald-600 text-[12px] mt-1">Tap u/ ulang</Text>
                            </>
                        ) : (
                            <>
                                <View className="w-14 h-14 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                                    <Camera size={28} color="#64748b" />
                                </View>
                                <Text className="text-slate-600 font-bold text-[15px]">Ambil Foto Tanda Terima *</Text>
                                <Text className="text-slate-400 text-[12px] mt-1">Sbg. Pengganti Tanda Tangan</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`h-14 rounded-2xl flex-row items-center justify-center shadow-sm ${takerName && division && photoCaptured ? 'bg-blue-600' : 'bg-slate-300'}`}
                        activeOpacity={0.8}
                        disabled={!takerName || !division || !photoCaptured}
                        onPress={handleSubmit}
                        style={{
                            shadowColor: takerName && division && photoCaptured ? "#3b82f6" : "#cbd5e1",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 4
                        }}
                    >
                        <Text className="text-white font-bold text-[16px] tracking-wide">
                            KONFIRMASI PENGAMBILAN
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
