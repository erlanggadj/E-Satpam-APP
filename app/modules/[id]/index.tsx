import { ContainerCard } from '@/components/features/ContainerCard';
import { KeyLogCard } from '@/components/features/KeyLogCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useModuleStore } from '@/store/useModuleStore';
import { useSyncStore } from '@/store/useSyncStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, Archive, ArrowLeft, CheckCircle2, Clock, CloudOff, Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModuleHistoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Generic fallback state
    const allItems = useSyncStore((state) => state.items);
    const genericItems = allItems.filter((i) => i.moduleId === id);

    // Custom Module State
    const { containers, keys } = useModuleStore();
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

    const title = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Module';

    const handlePressTakeKey = useCallback((itemId: string) => {
        router.push(`/modules/keylog/${itemId}/checkout`);
    }, [router]);

    const renderKeyLogItem = useCallback(({ item }: { item: any }) => (
        <KeyLogCard keyRecord={item} onPressTake={() => handlePressTakeKey(item.id)} />
    ), [handlePressTakeKey]);

    const renderContainerItem = useCallback(({ item }: { item: any }) => (
        <ContainerCard container={item} />
    ), []);

    // --- RENDER CUSTOM MODULE TABS AND LISTS --- //
    const renderCustomModuleContent = () => {
        let listData: any[] = [];
        let renderItem = id === 'container' ? renderContainerItem : renderKeyLogItem;

        if (id === 'container') {
            listData = activeTab === 'ACTIVE'
                ? containers.filter(c => c.status === 'IN')
                : containers.filter(c => c.status === 'OUT');
        } else if (id === 'keylog') {
            listData = activeTab === 'ACTIVE'
                ? keys.filter(k => k.status === 'DEPOSITED')
                : keys.filter(k => k.status === 'TAKEN');
        }

        return (
            <View className="flex-1">
                <View className="flex-row mx-5 mt-4 mb-2 bg-slate-100 p-1 rounded-xl">
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg"
                        style={activeTab === 'ACTIVE' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : {}}
                        onPress={() => setActiveTab('ACTIVE')}
                    >
                        <Activity size={16} color={activeTab === 'ACTIVE' ? '#ea580c' : '#64748b'} style={{ marginRight: 8 }} />
                        <Text className={`font-bold text-[13px] ${activeTab === 'ACTIVE' ? 'text-slate-800' : 'text-slate-500'}`}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-2.5 rounded-lg"
                        style={activeTab === 'HISTORY' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 } : {}}
                        onPress={() => setActiveTab('HISTORY')}
                    >
                        <Archive size={16} color={activeTab === 'HISTORY' ? '#ea580c' : '#64748b'} style={{ marginRight: 8 }} />
                        <Text className={`font-bold text-[13px] ${activeTab === 'HISTORY' ? 'text-slate-800' : 'text-slate-500'}`}>History</Text>
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
    const renderGenericFallback = () => (
        <ScrollView className="flex-1 p-5">
            {genericItems.length === 0 ? (
                <View className="flex-1 justify-center items-center py-20 mt-10">
                    <View className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <CloudOff size={40} color="#9CA3AF" />
                    </View>
                    <Text variant="h3" className="text-gray-400 mb-2">Belum Ada Riwayat</Text>
                    <Text className="text-gray-400 text-center max-w-[250px]">
                        Tidak ada data yang ditemukan untuk {title} pada shift ini.
                    </Text>
                </View>
            ) : (
                <View className="pb-20">
                    {genericItems.map((item) => (
                        <Card key={item.id} className="mb-4 bg-white/50 border-gray-100">
                            <CardContent className="p-4 flex flex-row items-start justify-between">
                                <View className="flex-1">
                                    <Text variant="p" className="font-semibold mb-1">
                                        {item.data.nama_tamu || item.data.pos_jaga || 'Log: ' + item.id.substring(0, 8)}
                                    </Text>
                                    <Text variant="small" className="text-text-secondary mb-2">
                                        {item.data.tujuan || item.data.catatan || 'Tidak ada deskripsi rinci'}
                                    </Text>
                                    <Text variant="mono" className="text-xs text-gray-400">
                                        {new Date(item.created_at).toLocaleTimeString()}
                                    </Text>
                                </View>
                                <View className="ml-4 justify-center items-center">
                                    {item.sync_status === 1 ? (
                                        <View className="bg-status-success/10 p-2 rounded-full">
                                            <CheckCircle2 size={24} color="#10B981" />
                                        </View>
                                    ) : (
                                        <View className="bg-status-pending/10 p-2 rounded-full">
                                            <Clock size={24} color="#F59E0B" />
                                        </View>
                                    )}
                                </View>
                            </CardContent>
                        </Card>
                    ))}
                </View>
            )}
        </ScrollView>
    );

    const isCustomModule = id === 'container' || id === 'keylog';

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
