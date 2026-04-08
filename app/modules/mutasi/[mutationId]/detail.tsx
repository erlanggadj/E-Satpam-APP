import { useAuthStore } from '@/store/useAuthStore';
import { useModuleStore } from '@/store/useModuleStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock, Plus, User as UserIcon, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MutasiDetailScreen() {
    const router = useRouter();
    const { mutationId } = useLocalSearchParams<{ mutationId: string }>();

    const mutations = useModuleStore(state => state.mutations);
    const membersList = useModuleStore(state => state.mutationMembers);
    const activities = useModuleStore(state => state.mutationActivities);
    const addActivity = useModuleStore(state => state.addMutationActivity);
    const joinMutation = useModuleStore(state => state.joinMutation);
    const user = useAuthStore(state => state.user);

    const [modalVisible, setModalVisible] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    const [description, setDescription] = useState('');

    const masterRecord = useMemo(() => {
        return mutations.find(m => m.id === mutationId);
    }, [mutations, mutationId]);

    const shiftMembers = useMemo(() => {
        return membersList.filter(m => m.mutationId === mutationId);
    }, [membersList, mutationId]);

    const filteredActivities = useMemo(() => {
        return activities.filter(a => a.mutationId === mutationId);
    }, [activities, mutationId]);

    // BYOD Check-in Boolean (Removed for manual input)

    if (!masterRecord) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
                <Text className="text-slate-500">Mutasi Record Not Found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">
                    <Text className="font-bold text-slate-700">Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isActive = masterRecord.status === 'ACTIVE';

    const handleAddActivity = () => {
        if (!description.trim()) return;
        addActivity(mutationId as string, time, description, user?.name || "System");
        setDescription('');
        setModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row justify-between items-center px-5 pt-4 pb-5 bg-white border-b border-gray-100 shadow-sm z-10">
                <View className="flex-row items-center flex-1">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ArrowLeft size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <View className="flex-1 pr-4">
                        <Text className="text-[18px] font-bold text-slate-800 tracking-tight" numberOfLines={1}>
                            {masterRecord.posName}
                        </Text>
                        <Text className="text-slate-500 text-[12px] font-medium mt-0.5" numberOfLines={1}>
                            {masterRecord.shiftName}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Widget gabung shift sudah dihapus karena kembali ke skema Manual Input Create */}

                {/* --- SHIFT MEMBERS UI (Box List Model) --- */}
                <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3 ml-1">
                    Anggota Shift
                </Text>

                <View className="bg-white rounded-[20px] shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    {shiftMembers.length > 0 ? (
                        shiftMembers.map((member, index) => {
                            const isHadir = member.attendance === 'HADIR';
                            return (
                                <View
                                    key={member.id}
                                    className={`flex-row items-center justify-between p-4 ${index !== shiftMembers.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3 border border-slate-100">
                                            <UserIcon size={18} color="#64748b" />
                                        </View>
                                        <Text className="text-[#334155] text-[14px] font-bold flex-1" numberOfLines={1}>
                                            {member.guardName}
                                        </Text>
                                    </View>
                                    {isHadir ? (
                                        <View className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex-row items-center">
                                            <CheckCircle2 size={10} color="#10b981" style={{ marginRight: 4 }} />
                                            <Text className="text-emerald-700 text-[9px] font-bold uppercase tracking-widest">Hadir</Text>
                                        </View>
                                    ) : (
                                        <View className="bg-red-50 px-2 py-1 rounded border border-red-100">
                                            <Text className="text-red-600 text-[10px] font-bold uppercase tracking-widest">{member.attendance}</Text>
                                        </View>
                                    )}
                                </View>
                            )
                        })
                    ) : (
                        <View className="p-6 items-center justify-center">
                            <UserIcon size={32} color="#cbd5e1" style={{ marginBottom: 8 }} />
                            <Text className="text-slate-400 italic font-medium">Belum ada anggota terdaftar.</Text>
                        </View>
                    )}
                </View>


                {/* --- TIMELINE ACTIVITIES --- */}
                <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-4 ml-1">
                    Timeline Aktivitas
                </Text>

                {filteredActivities.length > 0 ? (
                    filteredActivities.map((act, index) => (
                        <View key={act.id} className="flex-row mb-6">
                            {/* Timeline Line & Dot (ORANGE) */}
                            <View className="w-12 items-center mr-2">
                                <View className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 items-center justify-center">
                                    <Clock size={14} color="#f97316" />
                                </View>
                                {index !== filteredActivities.length - 1 ? (
                                    <View className="flex-1 w-px bg-orange-100 my-1 min-h-[40px]" />
                                ) : null}
                            </View>

                            {/* Content */}
                            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-orange-600 font-black tracking-widest text-[14px]">
                                        {act.time}
                                    </Text>
                                    <View className="flex-row items-center bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        <UserIcon size={10} color="#64748b" style={{ marginRight: 4 }} />
                                        <Text className="text-slate-500 text-[10px] font-bold uppercase" numberOfLines={1}>{act.guardName}</Text>
                                    </View>
                                </View>
                                <Text className="text-slate-700 text-[14px] leading-relaxed">
                                    {act.description}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="py-16 items-center justify-center">
                        <Clock size={40} color="#cbd5e1" style={{ marginBottom: 16 }} />
                        <Text className="text-slate-400 font-bold text-[15px]">Belum ada aktivitas</Text>
                        <Text className="text-slate-400 text-[12px] mt-1 text-center px-4">
                            Log aktivitas akan muncul pada timeline ini.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB - ALWAYS SHOW IF ACTIVE */}
            {isActive ? (
                <TouchableOpacity
                    className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            ) : null}

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
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 -mr-2 bg-gray-100 rounded-full">
                                <X size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-slate-400 text-[12px] font-bold uppercase tracking-widest mb-2 ml-1">Pukul</Text>
                        <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
                            <TextInput
                                className="text-slate-800 text-[15px] font-medium"
                                value={time}
                                onChangeText={setTime}
                                placeholder="00:00"
                            />
                        </View>

                        <Text className="text-slate-400 text-[12px] font-bold uppercase tracking-widest mb-2 ml-1">Kegiatan</Text>
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
