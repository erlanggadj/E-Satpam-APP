import { ContainerCard } from '@/components/features/ContainerCard';
import { GenericModuleCard } from '@/components/features/GenericModuleCard';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useModuleStore } from '@/store/useModuleStore';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, Archive, ArrowLeft, CloudOff, Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModuleHistoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Generic fallback state
    const allItems = useSyncStore((state) => state.items);
    const genericItems = allItems.filter((i) => i.moduleId === id);

    // Custom Module State
    const { containers } = useModuleStore();
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

    const title = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Module';

    const renderContainerItem = useCallback(({ item }: { item: any }) => (
        <ContainerCard container={item} />
    ), []);

    const renderCustomModuleContent = () => {
        let listData: any[] = [];
        let renderItem = renderContainerItem;

        if (id === 'container') {
            listData = activeTab === 'ACTIVE'
                ? containers.filter(c => c.status === 'IN')
                : containers.filter(c => c.status === 'OUT');
        }

        return (
            <View className="flex-1">
                <View className="flex-row mx-5 mt-4 mb-2 bg-slate-100 p-1 rounded-xl">
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg"
                        style={activeTab === 'ACTIVE'
                            ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }
                            : { backgroundColor: 'transparent' }}
                        onPress={() => setActiveTab('ACTIVE')}
                    >
                        <Activity size={16} color={activeTab === 'ACTIVE' ? '#ea580c' : '#64748b'} style={{ marginRight: 8 }} />
                        <Text className="font-bold text-[13px]" style={{ color: activeTab === 'ACTIVE' ? '#1e293b' : '#64748b' }}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg"
                        style={activeTab === 'HISTORY'
                            ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }
                            : { backgroundColor: 'transparent' }}
                        onPress={() => setActiveTab('HISTORY')}
                    >
                        <Archive size={16} color={activeTab === 'HISTORY' ? '#ea580c' : '#64748b'} style={{ marginRight: 8 }} />
                        <Text className="font-bold text-[13px]" style={{ color: activeTab === 'HISTORY' ? '#1e293b' : '#64748b' }}>History</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={listData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-20 mt-10">
                            <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <CloudOff size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-400 mb-2">Kosong</Text>
                            <Text className="text-gray-400 text-center max-w-[250px]">
                                {`Tidak ada data ${activeTab === 'ACTIVE' ? 'aktif' : 'riwayat'} saat ini.`}
                            </Text>
                        </View>
                    )}
                />
            </View>
        );
    };

    // --- RENDER FALLBACK GENERIC RECORDING LIST --- //
    const renderGenericFallback = () => {
        const listData = activeTab === 'ACTIVE'
            ? genericItems.filter(i => i.sync_status === 0)
            : genericItems.filter(i => i.sync_status === 1);

        return (
            <View className="flex-1">
                <View className="flex-row mx-5 mt-4 mb-2 bg-slate-100 p-1 rounded-xl">
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg"
                        style={activeTab === 'ACTIVE'
                            ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }
                            : { backgroundColor: 'transparent' }}
                        onPress={() => setActiveTab('ACTIVE')}
                    >
                        <Activity size={16} color={activeTab === 'ACTIVE' ? '#ea580c' : '#64748b'} style={{ marginRight: 8 }} />
                        <Text className="font-bold text-[13px]" style={{ color: activeTab === 'ACTIVE' ? '#1e293b' : '#64748b' }}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg"
                        style={activeTab === 'HISTORY'
                            ? { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }
                            : { backgroundColor: 'transparent' }}
                        onPress={() => setActiveTab('HISTORY')}
                    >
                        <Archive size={16} color={activeTab === 'HISTORY' ? '#ea580c' : '#64748b'} style={{ marginRight: 8 }} />
                        <Text className="font-bold text-[13px]" style={{ color: activeTab === 'HISTORY' ? '#1e293b' : '#64748b' }}>History</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={listData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GenericModuleCard item={item} onAfterSubmit={() => setActiveTab('HISTORY')} />
                    )}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-20 mt-10">
                            <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <CloudOff size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-400 mb-2">Kosong</Text>
                            <Text className="text-gray-400 text-center max-w-[250px]">
                                {`Tidak ada data ${activeTab === 'ACTIVE' ? 'Pending' : 'Tersinkronisasi'} untuk modul ini.`}
                            </Text>
                        </View>
                    )}
                />
            </View>
        );
    };

    const isCustomModule = id === 'container';

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Custom Header */}
            <View className="flex flex-row items-center p-5 border-b border-gray-200 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text variant="h2" className="flex-1">{isCustomModule ? `Modul ${title}` : `Riwayat ${title}`}</Text>
            </View>

            {isCustomModule ? renderCustomModuleContent() : renderGenericFallback()}

            {/* Floating Action Button */}
            <View className="absolute bottom-6 right-6 shadow-xl">
                <Button
                    variant="default"
                    size="icon"
                    className="w-16 h-16 rounded-full shadow-lg items-center justify-center bg-primary"
                    onPress={() => router.push(`/modules/${id}/create`)}
                >
                    <Plus size={32} color="white" />
                </Button>
            </View>
        </SafeAreaView>
    );
}
