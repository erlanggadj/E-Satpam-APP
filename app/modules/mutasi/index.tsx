import { MutationCard } from '@/components/features/MutationCard';
import { MutasiRecord, useModuleStore } from '@/store/useModuleStore';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Inbox, Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MutasiIndexScreen() {
    const router = useRouter();
    const mutations = useModuleStore(state => state.mutations);
    const createMutation = useModuleStore(state => state.createMutation);
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'SUBMITTED'>('ACTIVE');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMutations = useMemo(() => {
        return mutations.filter(m => {
            if (m.status !== activeTab) return false;
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return m.posName.toLowerCase().includes(q) ||
                m.shiftName.toLowerCase().includes(q) ||
                m.createdBy.toLowerCase().includes(q);
        });
    }, [mutations, activeTab, searchQuery]);

    const renderItem = useCallback(({ item }: { item: MutasiRecord }) => {
        return <MutationCard mutation={item} onAfterSubmit={() => setActiveTab('SUBMITTED')} />;
    }, []);

    const EmptyState = useCallback(() => (
        <View className="py-20 items-center justify-center">
            <Inbox size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <Text className="text-slate-400 font-bold text-[16px]">Belum Ada Data Mutasi</Text>
            <Text className="text-slate-400 text-[12px] mt-1 text-center px-8">
                {activeTab === 'ACTIVE'
                    ? "Klik tombol tambah di bawah untuk membuat Lembar Mutasi baru untuk shift ini."
                    : "Belum ada Lembar Mutasi yang disubmit."}
            </Text>
        </View>
    ), [activeTab]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex flex-row items-center p-5 border-b border-gray-200 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="flex-1 text-[20px] font-bold text-slate-900 tracking-tight">Lembar Mutasi</Text>
            </View>

            <View className="bg-white px-5 pt-4 pb-4 shadow-sm z-10">

                <View className="flex-row bg-slate-100 p-1 rounded-xl">
                    <TouchableOpacity
                        style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: activeTab === 'ACTIVE' ? '#ffffff' : 'transparent', elevation: activeTab === 'ACTIVE' ? 1 : 0, shadowOpacity: activeTab === 'ACTIVE' ? 0.05 : 0 }}
                        onPress={() => setActiveTab('ACTIVE')}
                    >
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: activeTab === 'ACTIVE' ? '#1e293b' : '#94a3b8' }}>Belum Di Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: activeTab === 'SUBMITTED' ? '#ffffff' : 'transparent', elevation: activeTab === 'SUBMITTED' ? 1 : 0, shadowOpacity: activeTab === 'SUBMITTED' ? 0.05 : 0 }}
                        onPress={() => setActiveTab('SUBMITTED')}
                    >
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: activeTab === 'SUBMITTED' ? '#1e293b' : '#94a3b8' }}>Sudah Di Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* SEARCH BAR */}
            <View className="px-5 pb-3 pt-1 bg-white border-b border-slate-200 shadow-sm z-0">
                <View className="flex-row bg-slate-100 rounded-xl px-4 py-2.5 items-center border border-slate-200">
                    <Text className="mr-2 opacity-50">🔍</Text>
                    <TextInput
                        className="flex-1 text-slate-800 text-[14px]"
                        placeholder="Cari pos, shift, pembuat..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
            </View>

            <FlatList
                data={filteredMutations}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={EmptyState}
            />

            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                onPress={() => router.push('/modules/mutasi/create')}
                activeOpacity={0.8}
            >
                <Plus size={24} color="#fff" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}
