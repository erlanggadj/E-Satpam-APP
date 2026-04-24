import { LaporanKejadianCard } from '@/components/features/LaporanKejadianCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, CloudOff, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KejadianIndexScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const canCreate = user?.role === 'ADMIN' || (user?.role === 'SATPAM' && user?.jabatan !== 'KAPAMWIL');
    const [searchQuery, setSearchQuery] = useState('');
    const allItems = useSyncStore((state) => state.items);
    const [refreshing, setRefreshing] = useState(false);
    const hasFetchedOnce = React.useRef(allItems.filter(i => i.moduleId === 'kejadian').length > 0);
    const [isLoading, setIsLoading] = useState(!hasFetchedOnce.current);

    const isToday = (dateStr: string) =>
        new Date(dateStr).toDateString() === new Date().toDateString();

    const fetchServerData = async () => {
        try {
            const res = await api.get('/kejadian');
            if (res.data?.success && Array.isArray(res.data?.data)) {
                useSyncStore.getState().syncServerData('kejadian', res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch kejadian data', error);
        } finally {
            setIsLoading(false);
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

    // Filter: hanya modul kejadian + hari ini saja (dashboard view)
    const rawItems = allItems.filter(i => i.moduleId === 'kejadian' && isToday(i.created_at));

    const filteredRaw = rawItems.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (item.data.nomor || '').toLowerCase().includes(q) ||
            (item.data.perihal || '').toLowerCase().includes(q) ||
            JSON.stringify(item.data).toLowerCase().includes(q);
    });

    const mappedItems = filteredRaw.map(item => ({
        id: item.id,
        nomor: item.data.nomor || 'NO-REF',
        perihal: item.data.perihal || 'Tidak Ada Perihal',
        waktu: item.data.tanggal ? `${item.data.tanggal} ${item.data.pukul}` : new Date(item.created_at).toLocaleDateString(),
        status: item.sync_status === 1 ? 'SELESAI' : ('DIPROSES' as any),
        sync_status: item.sync_status || 0
    }));

    const renderSkeletonCard = () => (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-2">
                <Skeleton width={44} height={20} borderRadius={10} style={{ marginRight: 10 }} />
                <Skeleton width="60%" height={14} />
            </View>
            <Skeleton width="85%" height={12} style={{ marginBottom: 4 }} />
            <Skeleton width="45%" height={11} />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex flex-row items-center p-5 border-b border-gray-100 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Log Kejadian Hari Ini</Text>
            </View>

            {/* SEARCH BAR */}
            <View className="px-5 py-3 bg-white border-b border-slate-200 shadow-sm z-0">
                <View className="flex-row bg-slate-100 rounded-xl px-4 py-2.5 items-center border border-slate-200">
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 text-slate-800 text-[14px]"
                        placeholder="Cari kejadian..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
            </View>

            <View className="flex-1">
                {isLoading ? (
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                        {Array.from({ length: 5 }).map((_, i) => <View key={`sk-${i}`}>{renderSkeletonCard()}</View>)}
                    </ScrollView>
                ) : (
                    <FlatList
                        data={mappedItems}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <LaporanKejadianCard item={item} />}
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
                                    Belum ada riwayat laporan kejadian.
                                </Text>
                            </View>
                        )}
                    />
                )}
            </View>

            {/* Floating Action Button */}
            {canCreate && (
                <View className="absolute bottom-6 right-6 shadow-xl">
                    <Button
                        variant="default"
                        size="icon"
                        className="w-16 h-16 rounded-full shadow-lg items-center justify-center bg-[#ea580c]"
                        onPress={() => router.push(`/modules/kejadian/create`)}
                    >
                        <Plus size={32} color="white" />
                    </Button>
                </View>
            )}
        </SafeAreaView>
    );
}
