import { AfkirCard } from '@/components/features/AfkirCard';
import { Button } from '@/components/ui/Button';
import { api } from '@/config/api';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, PackageOpen, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AfkirIndexScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'MASUK' | 'KELUAR'>('MASUK');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const allAfkirs = useModuleStore((state) => state.afkirs);
    const isToday = (dateStr: string) =>
        new Date(dateStr).toDateString() === new Date().toDateString();

    const fetchServerData = async () => {
        try {
            const res = await api.get('/afkir');
            if (res.data?.success && Array.isArray(res.data?.data)) {
                useModuleStore.getState().syncServerData('afkirs', res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch afkir data', error);
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

    // Dashboard: hanya hari ini saja
    const displayedAfkirs = allAfkirs.filter(c => {
        if (!isToday(c.checkInTime)) return false;
        if (activeTab === 'MASUK' ? c.status !== 'IN' : c.status !== 'OUT') return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return c.plateNumber.toLowerCase().includes(q) ||
            c.driverName.toLowerCase().includes(q) ||
            c.itemType.toLowerCase().includes(q);
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
                    <Text className="flex-1 text-[18px] font-bold text-slate-800 tracking-tight">Log Barang Afkir/Scrap</Text>
                </View>
            </SafeAreaView>

            {/* TABS */}
            <View className="flex-row px-5 py-3 bg-white border-b border-slate-100 shadow-sm z-0">
                <TouchableOpacity
                    className={`flex-1 py-2.5 items-center mr-2 rounded-full ${activeTab === 'MASUK' ? 'bg-[#4f46e5]' : 'bg-slate-100'}`}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('MASUK')}
                >
                    <Text className={`font-bold text-[13px] ${activeTab === 'MASUK' ? 'text-white' : 'text-slate-500'}`}>Di Area (Masuk)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-2.5 items-center ml-2 rounded-full ${activeTab === 'KELUAR' ? 'bg-[#4f46e5]' : 'bg-slate-100'}`}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('KELUAR')}
                >
                    <Text className={`font-bold text-[13px] ${activeTab === 'KELUAR' ? 'text-white' : 'text-slate-500'}`}>Selesai (Keluar)</Text>
                </TouchableOpacity>
            </View>

            {/* SEARCH BAR */}
            <View className="px-5 py-3 bg-white border-b border-slate-200 shadow-sm z-0">
                <View className="flex-row bg-slate-100 rounded-xl px-4 py-2.5 items-center border border-slate-200">
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 text-slate-800 text-[14px]"
                        placeholder="Cari plat, sopir, material..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
            </View>

            <View className="flex-1">
                <FlatList
                    data={displayedAfkirs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <AfkirCard afkir={item} />}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea580c']} />
                    }
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-20 mt-10">
                            <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <PackageOpen size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-400 mb-2">Kosong</Text>
                            <Text className="text-gray-400 text-center max-w-[250px]">
                                {activeTab === 'MASUK' ? 'Tidak ada kendaraan barang afkir di dalam area.' : 'Belum ada pencatatan penarikan barang afkir hari ini.'}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Floating Action Button */}
            {activeTab === 'MASUK' && (
                <View className="absolute bottom-6 right-6 shadow-xl">
                    <Button
                        variant="default"
                        size="icon"
                        className="w-16 h-16 rounded-full shadow-lg items-center justify-center bg-[#4f46e5]"
                        onPress={() => router.push(`/modules/afkir/create`)}
                    >
                        <Plus size={32} color="white" />
                    </Button>
                </View>
            )}
        </View>
    );
}
