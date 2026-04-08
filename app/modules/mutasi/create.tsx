import { useAuthStore } from '@/store/useAuthStore';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, BadgeInfo, Calendar, CheckCircle, ChevronDown, IdCard, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* --- Generic Bottom Sheet Dropdown Component --- */
const CustomDropdown = ({ label, value, options, onSelect }: { label: string, value: string, options: string[], onSelect: (val: string) => void }) => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <TouchableOpacity
                className="border border-slate-200 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
                activeOpacity={0.7}
                onPress={() => setVisible(true)}
            >
                <Text className={`text-[14px] ${value ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                    {value || `Pilih ${label}`}
                </Text>
                <ChevronDown size={18} color="#94a3b8" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <TouchableOpacity
                    className="flex-1 bg-black/40 justify-end"
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View className="bg-white rounded-t-3xl overflow-hidden pb-8">
                        <View className="bg-orange-50 px-5 py-4 border-b border-orange-100 flex-row justify-between items-center">
                            <Text className="text-orange-600 font-bold text-[15px]">Opsi {label}</Text>
                        </View>
                        {options.map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                className={`px-6 py-4 flex-row items-center justify-between ${i !== options.length - 1 ? 'border-b border-slate-100' : ''}`}
                                onPress={() => {
                                    onSelect(opt);
                                    setVisible(false);
                                }}
                            >
                                <Text className={`font-bold text-[15px] ${value === opt ? 'text-orange-500' : 'text-slate-700'}`}>{opt}</Text>
                                {value === opt && <CheckCircle size={18} color="#f97316" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default function CreateMutasiScreen() {
    const router = useRouter();
    const createMutation = useModuleStore(state => state.createMutation);
    const user = useAuthStore(state => state.user);

    const [aktivitas, setAktivitas] = useState('POS JAGA');
    const [lokasi, setLokasi] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US')); // Bisa diganti ke library datetimepicker nanti
    const [shift, setShift] = useState('Shift 1');

    const [petugas, setPetugas] = useState([
        { id: 1, nama: '', keterangan: 'Hadir', jabatan: 'Kashift' },
        { id: 2, nama: '', keterangan: 'Hadir', jabatan: 'Anggota' },
        { id: 3, nama: '', keterangan: 'Hadir', jabatan: 'Anggota' },
    ]);

    const updatePetugas = (index: number, field: string, value: string) => {
        const newPetugas = [...petugas];
        newPetugas[index] = { ...newPetugas[index], [field]: value };
        setPetugas(newPetugas);
    };

    const handleSimpan = () => {
        if (!lokasi.trim() || !shift.trim() || !aktivitas.trim()) {
            Alert.alert("Form Tidak Lengkap", "Silakan isi lokasi dan shift terlebih dahulu.");
            return;
        }

        const validMembers = petugas.filter(p => p.nama.trim().length > 0);
        if (validMembers.length === 0) {
            Alert.alert("Data Petugas Kosong", "Harap isi minimal 1 nama petugas.");
            return;
        }

        const mappedMembers = validMembers.map(p => ({
            guardName: `${p.nama} (${p.jabatan})`,
            attendance: p.keterangan.toUpperCase() as any
        }));

        createMutation(
            `${aktivitas} - ${lokasi}`,
            shift,
            user?.name || "System",
            mappedMembers
        );

        Alert.alert("Sukses", "Card Mutasi Berhasil Dicetak!");
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center px-5 pt-4 pb-5 bg-white shadow-sm z-10 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-[18px] font-bold text-slate-800 tracking-tight">Lembar Mutasi</Text>
                <View className="ml-auto w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
                    <IdCard size={20} color="#64748b" />
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    {/* AKTIVITAS CARD */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-5">
                            <BadgeInfo size={18} color="#ea580c" style={{ marginRight: 8 }} />
                            <Text className="font-bold text-slate-800 text-[15px]">Aktivitas</Text>
                        </View>

                        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Aktivitas Mutasi</Text>
                        <View className="mb-4">
                            <CustomDropdown
                                label="Aktivitas"
                                value={aktivitas}
                                options={['POS JAGA', 'PATROLI']}
                                onSelect={setAktivitas}
                            />
                        </View>

                        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lokasi</Text>
                        <View className="border border-slate-200 rounded-xl px-4 py-3 mb-4 bg-white">
                            <TextInput
                                className="text-slate-800 text-[14px]"
                                placeholder="Cth: Blok 1"
                                value={lokasi}
                                onChangeText={setLokasi}
                            />
                        </View>

                        <View className="flex-row justify-between mb-2">
                            <View className="flex-1 mr-3">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date (Input)</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white">
                                    <TextInput
                                        className="text-slate-700 text-[14px] flex-1"
                                        value={date}
                                        onChangeText={setDate}
                                    />
                                    <Calendar size={16} color="#475569" />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shift</Text>
                                <CustomDropdown
                                    label="Shift"
                                    value={shift}
                                    options={['Shift 1', 'Shift 2', 'Shift 3']}
                                    onSelect={setShift}
                                />
                            </View>
                        </View>
                    </View>

                    {/* PETUGAS CARDS */}
                    {petugas.map((p, index) => (
                        <View key={p.id} className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                            <View className="flex-row items-center mb-5">
                                <IdCard size={18} color="#ea580c" style={{ marginRight: 8 }} />
                                <Text className="font-bold text-slate-800 text-[15px]">Identitas Petugas {index + 1}</Text>
                            </View>

                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 mb-4 bg-white">
                                <TextInput
                                    className="text-slate-800 text-[14px] font-medium"
                                    placeholder="Masukan nama"
                                    value={p.nama}
                                    onChangeText={(val) => updatePetugas(index, 'nama', val)}
                                />
                            </View>

                            <View className="flex-row justify-between">
                                <View className="flex-1 mr-3">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keterangan</Text>
                                    <CustomDropdown
                                        label="Keterangan"
                                        value={p.keterangan}
                                        options={['Hadir', 'Sakit', 'Alfa']}
                                        onSelect={(val) => updatePetugas(index, 'keterangan', val)}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jabatan</Text>
                                    <CustomDropdown
                                        label="Jabatan"
                                        value={p.jabatan}
                                        options={['Anggota', 'Kashift']}
                                        onSelect={(val) => updatePetugas(index, 'jabatan', val)}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        className="bg-[#ea580c] py-4 rounded-xl flex-row items-center justify-center mt-2 mb-10 shadow-sm overflow-hidden"
                        onPress={handleSimpan}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] mr-2">Submit Mutasi</Text>
                        <Send size={16} color="#ffffff" style={{ marginLeft: 4, transform: [{ rotate: '-45deg' }, { translateY: -4 }] }} />
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
