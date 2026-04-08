import { KeyRecord } from '@/store/useModuleStore';

import { CheckCircle2, Clock, Key, UserCheck } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface KeyLogCardProps {
    keyRecord: KeyRecord;
    onPressTake?: () => void;
}

export function KeyLogCard({ keyRecord, onPressTake }: KeyLogCardProps) {
    const handleTakeKey = () => {
        if (onPressTake) onPressTake();
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-gray-100 flex-row">
            {/* Icon Area */}
            <View className="mr-4 items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-1">
                    <Key size={24} color="#3b82f6" />
                </View>
                {keyRecord.status === 'TAKEN' ? (
                    <View className="bg-emerald-100 px-2 py-0.5 rounded flex-row items-center mt-1">
                        <CheckCircle2 size={10} color="#10B981" />
                        <Text className="text-emerald-700 text-[9px] font-bold ml-1 uppercase">Selesai</Text>
                    </View>
                ) : (
                    <View className="bg-blue-100 px-2 py-0.5 rounded mt-1">
                        <Text className="text-blue-700 text-[10px] font-bold uppercase">TERSEDIA</Text>
                    </View>
                )}
            </View>

            {/* Main Info Area */}
            <View className="flex-1 justify-center">
                <Text className="text-slate-800 text-[18px] font-bold tracking-tight mb-0.5">
                    {keyRecord.keyName}
                </Text>
                <Text className="text-slate-500 text-[13px] font-medium mb-3">
                    Titip oleh: {keyRecord.depositedBy}
                </Text>

                <View className="flex-col gap-1.5 mb-1">
                    <View className="flex-row items-center">
                        <Clock size={12} color="#94a3b8" />
                        <Text className="text-slate-500 text-[12px] font-medium ml-1">
                            Waktu Titip: {formatTime(keyRecord.depositTime)}
                        </Text>
                    </View>

                    {keyRecord.status === 'TAKEN' ? (
                        <View className="flex-row items-center">
                            <UserCheck size={12} color="#10B981" />
                            <Text className="text-emerald-600 text-[12px] font-medium ml-1">
                                Diambil oleh: {keyRecord.takenBy} ({formatTime(keyRecord.takeTime)})
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* Action Button - Only show if actively DEPOSITED */}
                {keyRecord.status === 'DEPOSITED' ? (
                    <TouchableOpacity
                        className="mt-3 py-2.5 px-4 rounded-xl bg-blue-600 flex-row justify-center items-center shadow-sm"
                        style={{
                            shadowColor: "#3b82f6",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                        activeOpacity={0.8}
                        onPress={handleTakeKey}
                    >
                        <Text className="text-white font-bold text-[13px] tracking-wide">
                            AMBIL KUNCI
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}
