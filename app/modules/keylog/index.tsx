import { KeyLogCard } from '@/components/features/KeyLogCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Key, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KeyLogIndexScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const canCreate = user?.role === 'ADMIN' || (user?.role === 'SATPAM' && user?.jabatan !== 'KAPAMWIL');
    const [activeTab, setActiveTab] = useState<'TERSEDIA' | 'RIWAYAT'>('TERSEDIA');
    const [searchQuery, setSearchQuery] = useState('');
    const allKeys = useModuleStore((state) => state.keys);
    const [refreshing, setRefreshing] = useState(false);
    const hasFetchedOnce = React.useRef(allKeys.length > 0);
    const [isLoading, setIsLoading] = useState(!hasFetchedOnce.current);

    const isToday = (dateStr: string) =>
        new Date(dateStr).toDateString() === new Date().toDateString();

    const fetchServerData = async () => {
        try {
            const res = await api.get('/keylog');
            if (res.data?.success && Array.isArray(res.data?.data)) {
                useModuleStore.getState().syncServerData('keys', res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch keylog data', error);
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

    const displayedKeys = allKeys.filter(k => {
        if (!isToday(k.depositTime)) return false; // Dashboard: hari ini saja
        if (activeTab === 'TERSEDIA' ? k.status !== 'DEPOSITED' : k.status !== 'TAKEN') return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return k.keyName.toLowerCase().includes(q) || k.depositorName.toLowerCase().includes(q);
    });

    const renderSkeletonCard = () => (
        <View className="bg-white rounded-2xl p-4 mx-5 mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                    <Skeleton width={36} height={36} borderRadius={18} />
                    <View className="ml-3 flex-1">
                        <Skeleton width="50%" height={14} style={{ marginBottom: 6 }} />
                        <Skeleton width="35%" height={11} />
                    </View>
                </View>
                <Skeleton width={70} height={24} borderRadius={12} />
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-slate-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <SafeAreaView className="bg-white border-b border-gray-100 shadow-sm z-10" edges={['top']}>
                <View className="flex flex-row items-center p-5 pt-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Log Serah Terima Kunci</Text>
                </View>
            </SafeAreaView>

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

            {/* SEARCH BAR */}
            <View className="px-5 py-3 bg-white border-b border-slate-200 shadow-sm z-0">
                <View className="flex-row bg-slate-100 rounded-xl px-4 py-2.5 items-center border border-slate-200">
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 text-slate-800 text-[14px]"
                        placeholder="Cari nama kunci atau penitip..."
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
                        data={displayedKeys}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <KeyLogCard keyRecord={item} />}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea580c']} />
                        }
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
                )}
            </View>

            {/* Floating Action Button */}
            {activeTab === 'TERSEDIA' && canCreate && (
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
        </View>
    );
}
