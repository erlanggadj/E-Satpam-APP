import { Skeleton } from '@/components/ui/Skeleton';
import { syncAllPendingData } from '@/hooks/useBackgroundSync';
import { useAuthStore } from '@/store/useAuthStore';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock, Plus, User as UserIcon, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MutasiDetailScreen() {
    const router = useRouter();
    const { mutationId, source, title } = useLocalSearchParams<{ mutationId: string, source?: string, title?: string }>();

    const mutations = useModuleStore(state => state.mutations);
    const membersList = useModuleStore(state => state.mutationMembers);
    const activities = useModuleStore(state => state.mutationActivities);
    const addActivity = useModuleStore(state => state.addMutationActivity);
    const joinMutation = useModuleStore(state => state.joinMutation);
    const user = useAuthStore(state => state.user);

    const canCreate = user?.role === 'ADMIN' || (user?.role === 'SATPAM' && user?.jabatan !== 'KAPAMWIL');

    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [fetchedRecord, setFetchedRecord] = useState<any>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const hasFetched = React.useRef<string | null>(null);

    const masterRecord = useMemo(() => {
        return mutations.find(m => String(m.id) === String(mutationId));
    }, [mutations, mutationId]);

    const fetchServerData = React.useCallback(async (silent = false) => {
        if (!mutationId) return;
        if (!silent) setIsLoadingFetch(true);
        try {
            const { api } = await import('@/config/api');
            const res = await api.get(`/mutasi/${mutationId}`);
            const data = res.data.data;
            setFetchedRecord(data);
            useModuleStore.getState().upsertRecord('mutations', data);
            if (data.members) useModuleStore.getState().syncServerData('mutationMembers', data.members);
            if (data.activities) useModuleStore.getState().syncServerData('mutationActivities', data.activities);
        } catch (err) {
            console.error('Failed to fetch remote mutasi', err);
        } finally {
            setIsLoadingFetch(false);
        }
    }, [mutationId]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchServerData(true);
        setRefreshing(false);
    }, [fetchServerData]);

    React.useEffect(() => {
        if (!mutationId) return;

        // Check if we have enough local data to skip skeletons
        const localMembers = membersList[mutationId] || [];
        const localActivities = activities[mutationId] || [];
        // We only skip skeletons if we have ACTUAL content (members or activities)
        // If we only have masterRecord, we still show skeletons for the lists.
        const hasContentData = localMembers.length > 0 || localActivities.length > 0;

        // Trigger initial fetch
        if (hasFetched.current !== mutationId) {
            hasFetched.current = mutationId;
            fetchServerData(!!hasContentData); // silent=true only if we have actual content
        }

        // Setup polling every 5 seconds for real-time updates
        const interval = setInterval(() => {
            fetchServerData(true); // Always silent during polling
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [mutationId, fetchServerData]);



    const activeRecord = masterRecord || fetchedRecord;

    const shiftMembers = useMemo(() => {
        const localMembers = membersList[mutationId] || [];
        const serverMembers = fetchedRecord?.members || [];

        // Merge and de-duplicate by ID, preferring local for pending state
        const combined = [...localMembers];
        const localIds = new Set(localMembers.map(m => m.id));

        serverMembers.forEach((sm: any) => {
            if (!localIds.has(sm.id)) {
                // Ensure server-fetched items are marked as synced
                combined.push({ ...sm, sync_status: 1 });
            }
        });

        return combined;
    }, [membersList, mutationId, fetchedRecord]);


    const filteredActivities = useMemo(() => {
        const localActivities = activities[mutationId] || [];
        const serverActivities = fetchedRecord?.activities || [];

        // Merge and de-duplicate by ID, preferring local for pending state
        const combined = [...localActivities];
        const localIds = new Set(localActivities.map(a => a.id));

        serverActivities.forEach((sa: any) => {
            if (!localIds.has(sa.id)) {
                // Ensure server-fetched items are marked as synced
                combined.push({ ...sa, sync_status: 1 });
            }
        });

        // Optional: Sort by time to keep timeline order consistent
        return combined.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, [activities, mutationId, fetchedRecord]);



    const canApprove = source === 'history' && (user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.jabatan === 'KAPAMWIL') && activeRecord?.status !== 'APPROVED';

    const handleApprove = async () => {
        try {
            setIsApproving(true);
            const { api } = await import('@/config/api');
            await api.patch(`/history/mutasi/${mutationId}/approve`);

            // local state optimistic if exists
            useModuleStore.getState().approveRecord('mutations', mutationId as string);

            // @ts-ignore
            if (typeof global !== 'undefined' && global.alert) global.alert('Laporan berhasil divalidasi');
            router.back();
        } catch (error) {
            console.error('Failed to validate', error);
        } finally {
            setIsApproving(false);
        }
    };


    // Remove early loading return to keep header visible

    if (!activeRecord && !isLoadingFetch) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
                <Text className="text-slate-500">Mutasi Record Not Found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">
                    <Text className="font-bold text-slate-700">Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isActive = activeRecord?.status === 'ACTIVE';

    const handleAddActivity = () => {
        if (!description.trim()) return;
        const autoTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        addActivity(mutationId as string, autoTime, description, user?.name || "System");
        syncAllPendingData();
        setDescription('');
        setModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER - Always Visible */}
            <View className="flex flex-row items-center p-5 border-b border-gray-200 bg-white shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-[18px] font-bold text-slate-900 tracking-tight" numberOfLines={1}>
                        {activeRecord?.posName || title || 'Detail Mutasi'}
                    </Text>
                    <Text className="text-[14px] text-slate-500 font-medium">
                        {activeRecord?.shiftName || 'Memuat...'}
                    </Text>
                </View>
                {activeRecord?.status && (
                    <View className={`px-3 py-1 rounded-lg ${activeRecord.status === 'APPROVED' ? 'bg-green-100' : 'bg-blue-100'}`}>
                        <Text className={`text-[10px] font-bold ${activeRecord.status === 'APPROVED' ? 'text-green-700' : 'text-blue-700'}`}>
                            {activeRecord.status}
                        </Text>
                    </View>
                )}
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea580c']} />
                }
            >
                {/* 1. MEMBERS SECTION */}
                <View className="p-5">
                    <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">Anggota Shift</Text>

                    <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        {isLoadingFetch && shiftMembers.length === 0 ? (
                            <View>
                                {[1, 2, 3].map(i => (
                                    <View key={`skm-${i}`} className="flex-row items-center mb-4 pb-4 border-b border-slate-50">
                                        <Skeleton width={40} height={40} borderRadius={20} />
                                        <View className="ml-3 flex-1">
                                            <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
                                            <Skeleton width="40%" height={10} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : shiftMembers.length > 0 ? (
                            shiftMembers.map((member, index) => (
                                <View key={member.id} className={`flex-row items-center ${index < shiftMembers.length - 1 ? 'mb-4 pb-4 border-b border-slate-50' : ''}`}>
                                    <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center border border-slate-200">
                                        <UserIcon size={18} color="#64748b" />
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-slate-900 font-bold text-[15px]">{member.guardName}</Text>
                                        <Text className="text-slate-500 text-[12px]">Member • {member.attendance}</Text>
                                    </View>
                                    <View className="px-2 py-1 bg-green-50 rounded-lg">
                                        <Text className="text-green-600 font-bold text-[10px]">{member.attendance}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="py-4 items-center">
                                <Text className="text-slate-400 text-[13px]">Belum ada anggota terdaftar</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* 2. TIMELINE SECTION */}
                <View className="p-5 pt-0">
                    <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">Timeline Aktivitas</Text>

                    {isLoadingFetch && filteredActivities.length === 0 ? (
                        <View>
                            {[1, 2, 3].map(i => (
                                <View key={`ska-${i}`} className="flex-row mb-6">
                                    <View className="w-12 items-center mr-2">
                                        <Skeleton width={32} height={32} borderRadius={16} />
                                        <Skeleton width={2} height={40} style={{ marginVertical: 4 }} />
                                    </View>
                                    <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                        <View className="flex-row items-center justify-between mb-2">
                                            <Skeleton width="40%" height={14} />
                                            <Skeleton width="30%" height={14} />
                                        </View>
                                        <Skeleton width="100%" height={16} style={{ marginBottom: 4 }} />
                                        <Skeleton width="80%" height={16} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : filteredActivities.length > 0 ? (
                        filteredActivities.map((act, index) => (
                            <View key={act.id} className="flex-row mb-6">
                                <View className="w-12 items-center mr-2">
                                    {act.sync_status === 1 ? (
                                        <View className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center">
                                            <CheckCircle2 size={14} color="#10b981" />
                                        </View>
                                    ) : (
                                        <View className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 items-center justify-center">
                                            <Clock size={14} color="#f97316" />
                                        </View>
                                    )}
                                    {index !== filteredActivities.length - 1 && (
                                        <View className="flex-1 w-px bg-slate-200 my-1 min-h-[40px]" />
                                    )}
                                </View>
                                <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className="text-orange-600 font-bold text-[14px]">{act.time}</Text>
                                        <View className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            <Text className="text-slate-500 text-[10px] uppercase font-bold">{act.guardName}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-slate-700 text-[14px] leading-relaxed">{act.description}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="py-20 bg-white rounded-3xl items-center justify-center border border-dashed border-slate-200">
                            <Clock size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                            <Text className="text-slate-400 font-medium">Belum ada aktivitas</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ACTIONS: FAB & Status Bar */}
            {isActive && canCreate ? (
                <TouchableOpacity
                    className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            ) : isActive && user?.jabatan === 'KAPAMWIL' ? (
                <View className="absolute bottom-6 left-6 right-6 bg-slate-800/90 py-3 rounded-2xl items-center shadow-lg">
                    <Text className="text-white text-[12px] font-bold tracking-widest uppercase">Mode Monitoring (Read-Only)</Text>
                </View>
            ) : null}

            {/* Approval Button for KAPAMWIL */}
            {canApprove && (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-4 pb-6 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
                    <TouchableOpacity
                        className={`w-full ${isApproving ? 'bg-emerald-300' : 'bg-emerald-500'} py-4 rounded-xl items-center justify-center shadow-sm`}
                        onPress={handleApprove}
                        disabled={isApproving}
                    >
                        <Text className="text-white font-bold tracking-wide text-[14px]">
                            {isApproving ? 'MEMPROSES...' : 'VALIDASI / APPROVE'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Add Activity Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl pt-2 pb-8 px-6">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-[18px] font-bold text-slate-800">Add Activity</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-slate-100 rounded-full">
                                <X size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-slate-400 text-[12px] font-bold uppercase tracking-widest mb-2 ml-1">Keterangan Kegiatan</Text>
                        <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[100px] mb-8">
                            <TextInput
                                className="text-slate-800 text-[15px] leading-relaxed"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Tuliskan detail kegiatan di sini..."
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                        <TouchableOpacity
                            className="bg-orange-500 py-4 rounded-xl items-center shadow-sm"
                            onPress={handleAddActivity}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-bold text-[15px] tracking-wide">SIMPAN KEGIATAN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
