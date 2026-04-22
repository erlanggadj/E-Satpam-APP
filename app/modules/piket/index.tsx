import { PiketCard } from '@/components/features/PiketCard';
import { Button } from '@/components/ui/Button';
import { api } from '@/config/api';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PiketIndexScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const allItems = useSyncStore((state) => state.items);

    const isToday = (dateStr: string) =>
        new Date(dateStr).toDateString() === new Date().toDateString();

    const fetchServerData = async () => {
        try {
            const res = await api.get('/piket');
            if (res.data?.success && Array.isArray(res.data?.data)) {
                useSyncStore.getState().syncServerData('piket', res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch piket data', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchServerData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchServerData();
        setRefreshing(false);
    };

    // Filter: hanya piket + hari ini saja (dashboard view)
    const rawItems = allItems.filter(item => item.moduleId === 'piket' && isToday(item.created_at)).reverse();
    const piketItems = rawItems.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (item.data.petugas || '').toLowerCase().includes(q) ||
            (item.data.lokasi || '').toLowerCase().includes(q) ||
            JSON.stringify(item.data).toLowerCase().includes(q);
    });

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

            {/* SEARCH BAR */}
            <View className="px-5 py-3 bg-white border-b border-slate-200 shadow-sm z-0">
                <View className="flex-row bg-slate-100 rounded-xl px-4 py-2.5 items-center border border-slate-200">
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 text-slate-800 text-[14px]"
                        placeholder="Cari lokasi atau petugas..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
            </View>

            {/* List */}
            <View className="flex-1">
                <FlatList
                    data={piketItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PiketCard item={item} />}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea580c']} />
                    }
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
