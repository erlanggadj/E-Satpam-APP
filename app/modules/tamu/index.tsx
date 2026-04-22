import { TamuCard } from '@/components/features/TamuCard';
import { Button } from '@/components/ui/Button';
import { Text as CustomText } from '@/components/ui/Text';
import { api } from '@/config/api';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, CloudOff, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TamuHistoryScreen() {
    const router = useRouter();
    const moduleId = 'tamu';

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Generic fallback state
    const allItems = useSyncStore((state) => state.items);
    const genericItems = allItems.filter((i) => i.moduleId === moduleId);

    const title = 'Tamu';

    // Fetch from server on mount/focus
    const fetchServerData = async () => {
        try {
            const res = await api.get('/tamu'); // ?history=false defaults to today as per PRD
            if (res.data?.success && Array.isArray(res.data?.data)) {
                useSyncStore.getState().syncServerData('tamu', res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tamu data', error);
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

    // Filter only TODAY's records (dashboard view)
    const isToday = (dateStr: string) => {
        const itemDate = new Date(dateStr).toDateString();
        return itemDate === new Date().toDateString();
    };
    const todayItems = genericItems.filter(i => isToday(i.created_at));

    // Filter by search query and sort by newest first
    const listData = todayItems.filter(item => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        const itemTitle = (item.data.nama_tamu || item.data.pos_jaga || item.data.record_name || '').toLowerCase();
        return itemTitle.includes(searchLower) || JSON.stringify(item.data).toLowerCase().includes(searchLower);
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Custom Header */}
            <View className="flex flex-row items-center p-5 border-b border-slate-100 bg-white shadow-sm z-20">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <CustomText variant="h2" className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">
                    Riwayat {title}
                </CustomText>
            </View>

            <View className="flex-1">
                {/* SEARCH BAR */}
                <View className="px-5 py-3 bg-white border-b border-slate-200 shadow-sm z-10">
                    <View className="flex-row bg-slate-100 rounded-xl px-4 py-2.5 items-center border border-slate-200">
                        <Search size={18} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-slate-800 text-[14px]"
                            placeholder="Cari teks, nama, atau detail..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                </View>

                <FlatList
                    data={listData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TamuCard item={item} />}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea580c']} />
                    }
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-20 mt-10">
                            <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <CloudOff size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-400 mb-2">Kosong</Text>
                            <Text className="text-gray-400 text-center max-w-[250px]">
                                {searchQuery.length > 0
                                    ? `Tidak ditemukan data untuk "${searchQuery}".`
                                    : `Belum ada data riwayat untuk modul ini.`}
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
                    onPress={() => router.push(`/modules/${moduleId}/create` as any)}
                >
                    <Plus size={32} color="white" />
                </Button>
            </View>
        </SafeAreaView>
    );
}
