import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useRouter } from 'expo-router';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Camera,
    FileText,
    Info,
    Plus,
    UserMinus, Users,
    UserX
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

export default function LaporanKejadianCreateScreen() {
    const router = useRouter();
    const [nomor, setNomor] = useState('001/LK/SEC/GGF/IV/2026');
    const [perihal, setPerihal] = useState('');
    const [tempat, setTempat] = useState('');
    const [tanggal, setTanggal] = useState(new Date().toLocaleDateString('id-ID'));
    const [pukul, setPukul] = useState(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    const [korban_nama, setKorbanNama] = useState('');
    const [korban_alamat, setKorbanAlamat] = useState('');
    const [pelaku_nama, setPelakuNama] = useState('');
    const [pelaku_alamat, setPelakuAlamat] = useState('');
    const [saksi_1, setSaksi1] = useState('');
    const [saksi_2, setSaksi2] = useState('');
    const [saksi_3, setSaksi3] = useState('');
    const [saksi_4, setSaksi4] = useState('');
    const [bukti_1, setBukti1] = useState('');
    const [bukti_2, setBukti2] = useState('');
    const [bukti_3, setBukti3] = useState('');
    const [bukti_4, setBukti4] = useState('');
    const [kronologis, setKronologis] = useState('');
    const [kerugian, setKerugian] = useState('');
    const [tindakan, setTindakan] = useState('');

    const addItem = useSyncStore((state) => state.addItem);

    const handleSubmit = () => {
        addItem({
            id: uuidv4(),
            moduleId: 'kejadian',
            data: { nomor, perihal, tempat, tanggal, pukul, korban_nama, korban_alamat, pelaku_nama, pelaku_alamat, saksi_1, saksi_2, saksi_3, saksi_4, bukti_1, bukti_2, bukti_3, bukti_4, kronologis, kerugian, tindakan },
            sync_status: 1, // 1 = Selesai/Terkirim (No pending queue pattern based on discussion)
            created_at: new Date().toISOString()
        });

        Alert.alert('Sukses', 'Laporan Kejadian berhasil disimpan!', [
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
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Form Kejadian Baru</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    {/* 1. Detail Kejadian */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <Info color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Detail Kejadian</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nomor</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" value={nomor} onChangeText={setNomor} />
                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Perihal</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Perihal kejadian..." value={perihal} onChangeText={setPerihal} />
                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tempat Kejadian</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Pilih area/lokasi kejadian" value={tempat} onChangeText={setTempat} />
                            </View>
                        </View>

                        <View className="flex-row justify-between">
                            <View className="w-[48%] mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="DD/MM/YYYY" value={tanggal} onChangeText={setTanggal} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pukul</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="HH:mm" value={pukul} onChangeText={setPukul} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 2. Identitas Korban */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <UserX color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Identitas Korban</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Korban</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan nama" value={korban_nama} onChangeText={setKorbanNama} />
                            </View>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Alamat Korban</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan alamat lengkap" value={korban_alamat} onChangeText={setKorbanAlamat} />
                            </View>
                        </View>
                    </View>

                    {/* 3. Identitas Pelaku */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <UserMinus color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Identitas Pelaku</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Pelaku</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan nama pelaku" value={pelaku_nama} onChangeText={setPelakuNama} />
                            </View>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Alamat Pelaku</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Masukan alamat lengkap" value={pelaku_alamat} onChangeText={setPelakuAlamat} />
                            </View>
                        </View>
                    </View>

                    {/* 4. Saksi */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <Users color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Saksi</Text>
                        </View>
                        <View className="flex-row flex-wrap justify-between">
                            <View className="w-[48%] mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Saksi 1</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Nama Saksi 1" value={saksi_1} onChangeText={setSaksi1} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Saksi 2</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Nama Saksi 2" value={saksi_2} onChangeText={setSaksi2} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Saksi 3</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Nama Saksi 3" value={saksi_3} onChangeText={setSaksi3} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Saksi 4</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Nama Saksi 4" value={saksi_4} onChangeText={setSaksi4} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 5. Barang Bukti */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <Briefcase color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Barang Bukti</Text>
                        </View>
                        <View className="flex-row flex-wrap justify-between">
                            <View className="w-[48%] mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Barang Bukti 1</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Bukti 1" value={bukti_1} onChangeText={setBukti1} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Barang Bukti 2</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Bukti 2" value={bukti_2} onChangeText={setBukti2} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Barang Bukti 3</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Bukti 3" value={bukti_3} onChangeText={setBukti3} />
                                </View>
                            </View>
                            <View className="w-[48%] mb-2">
                                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Barang Bukti 4</Text>
                                <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                    <TextInput className="text-slate-800 text-[14px]" placeholder="Bukti 4" value={bukti_4} onChangeText={setBukti4} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 6. Kronologis & Kerugian */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <FileText color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Kronologis & Kerugian</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kronologis Kejadian</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white min-h-[100px]">
                                <TextInput
                                    className="text-slate-800 text-[14px]"
                                    placeholder="Jelaskan kejadian dengan detail"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={kronologis}
                                    onChangeText={setKronologis}
                                />
                            </View>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Potensi Kerugian</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                <TextInput className="text-slate-800 text-[14px]" placeholder="Kisaran jumlah kerugian (Rp...)" value={kerugian} onChangeText={setKerugian} />
                            </View>
                        </View>
                    </View>

                    {/* 7. Tindakan Pertama Tempat Kejadian Perkara */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-4">
                            <AlertTriangle color="#ea580c" size={18} style={{ marginRight: 8 }} />
                            <Text className="text-slate-800 font-bold text-[15px]">Tindakan Pertama TKP</Text>
                        </View>
                        <View className="mb-2">
                            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tindakan</Text>
                            <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white min-h-[100px]">
                                <TextInput
                                    className="text-slate-800 text-[14px]"
                                    placeholder="Jelaskan tindakan secara detail"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={tindakan}
                                    onChangeText={setTindakan}
                                />
                            </View>
                        </View>
                    </View>

                    {/* 8. Dokumentasi */}
                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Camera color="#ea580c" size={18} style={{ marginRight: 8 }} />
                                <Text className="text-slate-800 font-bold text-[15px]">Dokumentasi</Text>
                            </View>
                            <Text className="text-[11px] font-bold text-slate-400">0/5</Text>
                        </View>

                        <View className="flex-row flex-wrap gap-3">
                            <TouchableOpacity activeOpacity={0.7} className="w-[80px] h-[80px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 items-center justify-center">
                                <Plus color="#94a3b8" size={24} />
                                <Text className="text-slate-400 font-bold text-[10px] mt-1">ADD</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        className="bg-[#ea580c] py-4 rounded-xl flex-row items-center justify-center mt-2 mb-10 shadow-sm active:bg-orange-600"
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] tracking-wide">Submit Laporan</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
