import { KeyLogCard } from '@/components/features/KeyLogCard';
import { Button } from '@/components/ui/Button';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Key, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KeyLogIndexScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'TERSEDIA' | 'RIWAYAT'>('TERSEDIA');

    const allKeys = useModuleStore((state) => state.keys);
    const displayedKeys = allKeys.filter(k =>
        activeTab === 'TERSEDIA' ? k.status === 'DEPOSITED' : k.status === 'TAKEN'
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Log Serah Terima Kunci</Text>
            </View>

            {/* TABS */}
            <View className="flex-row px-5 py-3 bg-white border-b border-slate-100 shadow-sm z-0">
                <TouchableOpacity
                    className={`flex-1 py-2.5 items-center mr-2 rounded-full ${activeTab === 'TERSEDIA' ? 'bg-[#ea580c]' : 'bg-slate-100'}`}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('TERSEDIA')}
                >
                    <Text className={`font-bold text-[13px] ${activeTab === 'TERSEDIA' ? 'text-white' : 'text-slate-500'}`}>Tersedia</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-2.5 items-center ml-2 rounded-full ${activeTab === 'RIWAYAT' ? 'bg-[#ea580c]' : 'bg-slate-100'}`}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('RIWAYAT')}
                >
                    <Text className={`font-bold text-[13px] ${activeTab === 'RIWAYAT' ? 'text-white' : 'text-slate-500'}`}>Riwayat Selesai</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1">
                <FlatList
                    data={displayedKeys}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <KeyLogCard keyRecord={item} />}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-20 mt-10">
                            <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Key size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-400 mb-2">Kosong</Text>
                            <Text className="text-gray-400 text-center max-w-[250px]">
                                {activeTab === 'TERSEDIA' ? 'Tidak ada kunci yang dititipkan saat ini.' : 'Belum ada riwayat kunci yang selesai.'}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Floating Action Button */}
            {activeTab === 'TERSEDIA' && (
                <View className="absolute bottom-6 right-6 shadow-xl">
                    <Button
                        variant="default"
                        size="icon"
                        className="w-16 h-16 rounded-full shadow-lg items-center justify-center bg-[#ea580c]"
                        onPress={() => router.push(`/modules/keylog/create`)}
                    >
                        <Plus size={32} color="white" />
                    </Button>
                </View>
            )}
        </SafeAreaView>
    );
}
