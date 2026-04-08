import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { useSyncStore } from '@/store/useSyncStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Platform, ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';


// Generic schema for Demo purposes
const formSchema = z.object({
    field1: z.string().min(3, 'Pilih salah satu aktivitas').max(50),
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
        // Generate distinct fields based on module type for demo
        const displayData =
            id === 'tamu'
                ? { nama_tamu: data.field1, tujuan: data.field2 }
                : id === 'mutasi'
                    ? { pos_jaga: data.field1, catatan: data.field2 }
                    : { record_name: data.field1, detail: data.field2 };

        const newItem = {
            id: uuidv4(),
            moduleId: id as string,
            data: displayData,
            sync_status: 0 as const, // Pending Sync
            created_at: new Date().toISOString(),
        };

        addItem(newItem);

        // Show Toast for Offline Save
        if (Platform.OS === 'android') {
            ToastAndroid.show('Data disimpan offline', ToastAndroid.SHORT);
        } else {
            Alert.alert('Sukses', 'Data disimpan offline');
        }

        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View className="flex flex-row items-center p-5 border-b border-gray-200 bg-white shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#0347dcff" />
                </TouchableOpacity>
                <Text variant="h2" className="flex-1">Tambah {title}</Text>
            </View>

            <ScrollView className="flex-1 p-5">
                {/* CARD PERTAMA (Isinya Field 1, 2, 3) */}
                <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 mb-5">

                    <Controller
                        control={control}
                        name="field1"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                {id === 'mutasi' ? (
                                    <View>
                                        <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">AKTIVITAS MUTASI</Text>
                                        <View className="flex-row items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                                            {['PATROLI', 'POS JAGA'].map((chipOption) => {
                                                const isSelected = value === chipOption;
                                                return (
                                                    <TouchableOpacity
                                                        key={chipOption}
                                                        activeOpacity={0.8}
                                                        onPress={() => onChange(chipOption)}
                                                        className={`flex-1 py-3 rounded-lg flex-row items-center justify-center ${isSelected
                                                            ? 'bg-white'
                                                            : 'bg-transparent'
                                                            }`}
                                                        style={isSelected ? {
                                                            shadowColor: "#0f172a",
                                                            shadowOffset: { width: 0, height: 2 },
                                                            shadowOpacity: 0.05,
                                                            shadowRadius: 4,
                                                            elevation: 2,
                                                        } : {}}
                                                    >
                                                        <Text className={`text-[13px] font-bold tracking-wide ${isSelected ? 'text-[#ea580c]' : 'text-slate-500'}`}>
                                                            {chipOption}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                        {errors.field1 && (
                                            <Text className="text-red-500 text-xs mt-1 ml-1">{errors.field1.message}</Text>
                                        )}
                                    </View>
                                ) : (
                                    <Input
                                        label={id === 'tamu' ? 'Nama Tamu' : 'Field 1 (Wajib)'}
                                        placeholder="Masukkan data..."
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.field1?.message}
                                    />
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="field2"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Input
                                    label={id === 'tamu' ? 'Tujuan' : id === 'mutasi' ? 'LOKASI' : 'Field 2 (Opsional)'}
                                    placeholder="Masukkan detail..."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.field2?.message}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="field3"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Input
                                    label={id === 'tamu' ? 'Pukul' : id === 'mutasi' ? 'SHIFT' : 'Field 2 (Opsional)'}
                                    placeholder="Masukkan detail..."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.field3?.message}
                                />
                            </View>
                        )}
                    />

                </View>

                {/* CARD KEDUA (Card Baru) */}
                <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 mb-5">

                    {/* <Text variant="h3">Alamat</Text> */}
                    <Controller
                        control={control}
                        name="field4"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Input
                                    label={id === 'mutasi' ? 'KETERANGAN' : 'Field 4 (Wajib)'}
                                    placeholder="Masukkan data..."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.field4?.message}
                                />
                            </View>
                        )}
                    />


                    <Controller
                        control={control}
                        name="field5"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Input
                                    label={id === 'tamu' ? 'No Telp' : 'Field 5 (Wajib)'}
                                    placeholder="Masukkan data..."
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.field4?.message}
                                />
                            </View>
                        )}
                    />
                </View>

                <Button
                    onPress={handleSubmit(onSubmit)}
                    className="w-full flex-row items-center gap-2 mt-2 "
                >
                    <Save size={20} color="white" />
                    <Text className="text-white font-semibold text-base">Simpan Laporan</Text>
                </Button>

            </ScrollView>
        </SafeAreaView >
    );
}
