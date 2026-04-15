import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, BriefcaseBusiness, MapPin, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IzinCreateScreen() {
    const router = useRouter();
    const createIzin = useModuleStore((state) => state.createIzin);

    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [reasonType, setReasonType] = useState<'Kerja' | 'Pribadi'>('Kerja');
    const [destination, setDestination] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!name || !department || !destination || !note) {
            Alert.alert('Data Belum Lengkap', 'Seluruh field data wajib diisi!');
            return;
        }

        createIzin(name, department, reasonType, destination, note);

        Alert.alert('Sukses', 'Data pelaporan izin staff berhasil dibuat!', [
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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Data Izin Karyawan</Text>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6 border-b border-slate-100 pb-4">
                            <User color="#0ea5e9" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Identitas Karyawan</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px] font-bold" placeholder="Masukan nama karyawan..." value={name} onChangeText={setName} />
                            </View>
                        </View>

                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Departemen/Bagian</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: HRD, Produksi, Gudang..." value={department} onChangeText={setDepartment} />
                            </View>
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-6 border-b border-slate-100 pb-4">
                            <MapPin color="#0ea5e9" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Tujuan & Keperluan</Text>
                        </View>

                        <View className="mb-5">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Jenis Keperluan</Text>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${reasonType === 'Kerja' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200'}`}
                                    onPress={() => setReasonType('Kerja')}
                                    activeOpacity={0.7}
                                >
                                    <BriefcaseBusiness size={16} color={reasonType === 'Kerja' ? '#0ea5e9' : '#94a3b8'} style={{ marginRight: 6 }} />
                                    <Text className={`text-[13px] font-bold ${reasonType === 'Kerja' ? 'text-sky-700' : 'text-slate-500'}`}>Urusan Kerja</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${reasonType === 'Pribadi' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200'}`}
                                    onPress={() => setReasonType('Pribadi')}
                                    activeOpacity={0.7}
                                >
                                    <User size={16} color={reasonType === 'Pribadi' ? '#0ea5e9' : '#94a3b8'} style={{ marginRight: 6 }} />
                                    <Text className={`text-[13px] font-bold ${reasonType === 'Pribadi' ? 'text-sky-700' : 'text-slate-500'}`}>Urusan Pribadi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tujuan (Lokasi)</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Misal: Bank BCA, Plant 2..." value={destination} onChangeText={setDestination} />
                            </View>
                        </View>

                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keterangan / Alasan Lengkap</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white min-h-[80px]">
                                <TextInput
                                    className="text-slate-800 text-[14px]"
                                    placeholder="Jelaskan alasan izin / keperluan singkat..."
                                    value={note}
                                    onChangeText={setNote}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        className="bg-[#0ea5e9] py-4 rounded-xl flex-row items-center justify-center mt-2 mb-10 shadow-sm active:bg-sky-600"
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Proses Izin Keluar</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
