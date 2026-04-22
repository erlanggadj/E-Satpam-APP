import { SyncBadge } from '@/components/ui/SyncBadge';
import { useAuthStore } from '@/store/useAuthStore';
import { MutasiRecord, useModuleStore } from '@/store/useModuleStore';
import { useRouter } from 'expo-router';
import { ClipboardEdit, Plus, Send, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface MutationCardProps {
    mutation: MutasiRecord;
    onAfterSubmit?: () => void;
}

export function MutationCard({ mutation, onAfterSubmit }: MutationCardProps) {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    const [description, setDescription] = useState('');
    const isNavigating = useRef(false);

    const handleDetailPress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/mutasi/${mutation.id}/detail`);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const addActivity = useModuleStore(state => state.addMutationActivity);
    const submitMutation = useModuleStore(state => state.submitMutation);
    const user = useAuthStore(state => state.user);

    const handleAddActivity = () => {
        if (!description.trim()) return;
        addActivity(mutation.id, time, description, user?.name || "System");
        setDescription('');
        setModalVisible(false);
    };

    const handleSubmit = () => {
        // Tunda 300ms agar event gesture tap selesai sepenuhnya
        // Menghindari force close karena node UI hilang saat masih ditekan
        setTimeout(() => {
            submitMutation(mutation.id);
            onAfterSubmit?.();
        }, 300);
    };

    const formatDate = (isoStr: string) => {
        return new Date(isoStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const isActive = mutation.status === 'ACTIVE';

    return (
        <>
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleDetailPress}
                >
                    <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-3">
                                <ClipboardEdit size={20} color="#ea580c" />
                            </View>
                            <View className="flex-1 pr-4">
                                <Text className="text-slate-800 text-[15px] font-bold" numberOfLines={1}>{mutation.posName}</Text>
                                <Text className="text-slate-500 text-[12px] font-medium mt-0.5">{mutation.shiftName} • {formatDate(mutation.date)}</Text>
                            </View>
                        </View>
                        {isActive ? (
                            <View className="bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                <Text className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Shift Aktif</Text>
                            </View>
                        ) : (
                            <SyncBadge status={mutation.sync_status || 0} business_status={mutation.status} moduleType="MUTASI" />
                        )}
                    </View>
                </TouchableOpacity>

                {isActive ? (
                    <View className="flex-row space-x-3 gap-3 border-t border-slate-100 pt-3 mt-1">
                        <TouchableOpacity
                            className="flex-1 bg-white border border-orange-500 py-2.5 rounded-xl flex-row items-center justify-center active:bg-orange-50"
                            activeOpacity={0.7}
                            onPress={() => setModalVisible(true)}
                        >
                            <Plus size={16} color="#ea580c" style={{ marginRight: 6 }} />
                            <Text className="text-orange-500 font-bold text-[13px]">Add Activity</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-slate-800 px-4 py-2.5 rounded-xl flex-row items-center justify-center active:bg-slate-700"
                            activeOpacity={0.7}
                            onPress={handleSubmit}
                        >
                            <Send size={16} color="#ffffff" style={{ marginRight: 6 }} />
                            <Text className="text-white font-bold text-[13px]">Submit</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>

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
        </>
    );
}
