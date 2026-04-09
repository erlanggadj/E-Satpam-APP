import { useSyncStore } from '@/store/useSyncStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BadgeInfo, FileText, Key, Send } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
    field1: z.string().min(3, 'Data ini wajib diisi minimal 3 karakter').max(50),
    field2: z.string().optional(),
    field3: z.string().optional(),
    field4: z.string().optional(),
    field5: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateModuleScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const addItem = useSyncStore((state) => state.addItem);

    const title = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Module';

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            field1: '',
            field2: '',
            field3: '',
            field4: '',
            field5: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        const displayData =
            id === 'tamu'
                ? { nama_tamu: data.field1, tujuan: data.field2 }
                : id === 'keylog'
                    ? { key_name: data.field1, deposited_by: data.field2 }
                    : { record_name: data.field1, detail: data.field2 };

        const newItem = {
            id: uuidv4(),
            moduleId: id as string,
            data: displayData,
            sync_status: 0 as const,
            created_at: new Date().toISOString(),
        };

        addItem(newItem);

        if (Platform.OS === 'android') {
            ToastAndroid.show('Data disimpan offline', ToastAndroid.SHORT);
        } else {
            Alert.alert('Sukses', 'Data disimpan offline');
        }

        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Tambah {title}</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 px-5 pt-6 pb-8" showsVerticalScrollIndicator={false}>

                    <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-5">
                            {id === 'keylog' ? (
                                <Key size={18} color="#ea580c" style={{ marginRight: 8 }} />
                            ) : (
                                <BadgeInfo size={18} color="#ea580c" style={{ marginRight: 8 }} />
                            )}
                            <Text className="font-bold text-slate-800 text-[15px]">Informasi Dasar</Text>
                        </View>

                        <Controller
                            control={control}
                            name="field1"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        {id === 'tamu' ? 'Nama Tamu' : id === 'keylog' ? 'Nama Kunci' : 'Field 1 (Wajib)'}
                                    </Text>
                                    <View className={`border ${errors.field1 ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 bg-white`}>
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan data..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                    {errors.field1 && (
                                        <Text className="text-red-500 text-[10px] mt-1 ml-1">{errors.field1.message}</Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="field2"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        {id === 'tamu' ? 'Tujuan' : id === 'keylog' ? 'Dititip Oleh' : 'Field 2 (Opsional)'}
                                    </Text>
                                    <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan detail..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="field3"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        {id === 'tamu' ? 'Pukul' : id === 'keylog' ? 'Catatan Tambahan' : 'Field 3 (Opsional)'}
                                    </Text>
                                    <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan info..."
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
                            name="field4"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        {id === 'tamu' ? 'Keterangan' : 'Field 4 (Opsional)'}
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
                            name="field5"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        {id === 'tamu' ? 'No Telp' : 'Field 5 (Opsional)'}
                                    </Text>
                                    <View className="border border-slate-200 rounded-xl px-4 py-3 bg-white">
                                        <TextInput
                                            className="text-slate-800 text-[14px]"
                                            placeholder="Masukkan nomor kontak..."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-[#ea580c] py-4 rounded-xl flex-row items-center justify-center mt-2 mb-10 shadow-sm overflow-hidden active:bg-orange-600"
                        onPress={handleSubmit(onSubmit)}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[15px] mr-2">Simpan {title}</Text>
                        <Send size={16} color="#ffffff" style={{ marginLeft: 4, transform: [{ rotate: '-45deg' }, { translateY: -4 }] }} />
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
