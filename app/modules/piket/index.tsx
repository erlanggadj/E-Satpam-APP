import { PiketCard } from '@/components/features/PiketCard';
import { Button } from '@/components/ui/Button';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Plus } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PiketIndexScreen() {
    const router = useRouter();

    const allItems = useSyncStore((state) => state.items);

    // Reverse array to show newest first
    const piketItems = allItems.filter(item => item.moduleId === 'piket').reverse();

    return (
        <View className="flex-1 bg-slate-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <SafeAreaView className="bg-white border-b border-gray-100 shadow-sm z-10" edges={['top']}>
                <View className="flex flex-row items-center p-5 pt-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Riwayat Piket Staff</Text>
                </View>
            </SafeAreaView>

            {/* List */}
            <View className="flex-1">
                <FlatList
                    data={piketItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PiketCard item={item} />}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-20 mt-10">
                            <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <MapPin size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-400 mb-2">Kosong</Text>
                            <Text className="text-gray-400 text-center max-w-[250px]">
                                Belum ada riwayat piket yang dilaporkan.
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Floating Action Button */}
            <View className="absolute bottom-6 right-6 shadow-xl">
                <Button
                    variant="default"
                    size="icon"
                    className="w-16 h-16 rounded-full shadow-lg items-center justify-center bg-[#ea580c]"
                    onPress={() => router.push(`/modules/piket/create`)}
                >
                    <Plus size={32} color="white" />
                </Button>
            </View>
        </View>
    );
}
