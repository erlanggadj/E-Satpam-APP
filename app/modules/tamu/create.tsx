import { api } from '@/config/api';
import { useSyncStore } from '@/store/useSyncStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, BadgeInfo, FileText, Send } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
    namaTamu: z.string().min(3, 'Data ini wajib diisi minimal 3 karakter').max(50),
    tujuan: z.string().optional(),
    keterangan: z.string().optional(),
    noTelp: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTamuScreen() {
    const router = useRouter();
    const addItem = useSyncStore((state) => state.addItem);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaTamu: '',
            tujuan: '',
            keterangan: '',
            noTelp: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        const id = uuidv4();
        const pukul = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const payload = {
            namaTamu: data.namaTamu,
            tujuan: data.tujuan || '',
            pukul,
            keterangan: data.keterangan || '',
            noTelp: data.noTelp || '',
        };

        // 1. Save locally first (offline support)
        addItem({
            id,
            moduleId: 'tamu',
            data: { id, ...payload },
            sync_status: 0,
            created_at: new Date().toISOString(),
        });

        // 2. Navigate back IMMEDIATELY (no duplicate clicks possible)
        router.back();

        // 3. POST to backend in background (fire and forget)
        try {
            await api.post('/tamu', { id, ...payload });
            useSyncStore.getState().markItemAsSynced(id);
            console.log('[Tamu] ✅ Synced to backend');
        } catch (err) {
            console.warn('[Tamu] ❌ Gagal kirim ke backend, tersimpan offline:', err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Tambah Tamu</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-5">
                            <BadgeInfo size={18} color="#ea580c" style={{ marginRight: 8 }} />
                            <Text className="font-bold text-slate-800 text-[15px]">Informasi Dasar</Text>
                        </View>

                        <Controller
                            control={control}
                            name="namaTamu"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Nama Tamu
                                    </Text>
                                    <View className={`border ${errors.namaTamu ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 bg-white`}>
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan nama tamu..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                    {errors.namaTamu && (
                                        <Text className="text-red-500 text-[10px] mt-1 ml-1">{errors.namaTamu.message}</Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="tujuan"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Tujuan
                                    </Text>
                                    <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan detail tujuan..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-5">
                            <FileText size={18} color="#ea580c" style={{ marginRight: 8 }} />
                            <Text className="font-bold text-slate-800 text-[15px]">Data Tambahan</Text>
                        </View>

                        <Controller
                            control={control}
                            name="keterangan"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Keterangan
                                    </Text>
                                    <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Keterangan opsional..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            multiline
                                            numberOfLines={2}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="noTelp"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        No Telp
                                    </Text>
                                    <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan nomor kontak..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        className={`${isSubmitting ? 'bg-slate-400' : 'bg-[#ea580c]'} py-4 rounded-xl flex-row items-center justify-center mt-2 mb-10 shadow-sm overflow-hidden active:bg-orange-600`}
                        onPress={handleSubmit(onSubmit)}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                    >
                        <Text className="text-white font-bold text-[15px] mr-2">
                            {isSubmitting ? 'MENYIMPAN...' : 'Simpan Tamu'}
                        </Text>
                        {!isSubmitting && <Send size={16} color="#ffffff" style={{ marginLeft: 4, transform: [{ rotate: '-45deg' }, { translateY: -4 }] }} />}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
