import { ContainerRecord, useModuleStore } from '@/store/useModuleStore';
import { CheckCircle2, Clock, Truck } from 'lucide-react-native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface ContainerCardProps {
    container: ContainerRecord;
}

export function ContainerCard({ container }: ContainerCardProps) {
    const checkoutContainer = useModuleStore((state) => state.checkoutContainer);

    const handleCheckout = () => {
        Alert.alert(
            'Check Out Konfirmasi',
            `Apakah Anda yakin kontainer dengan plat ${container.plateNumber} akan keluar sekarang?`,
            [
                {
                    text: 'Batal',
                    style: 'cancel',
                },
                {
                    text: 'Check Out',
                    style: 'destructive',
                    onPress: () => checkoutContainer(container.id, new Date().toISOString()),
                },
            ]
        );
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
                <View className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-1">
                    <Truck size={24} color="#ea580c" />
                </View>
                {container.status === 'OUT' ? (
                    <View className="bg-emerald-100 px-2 py-0.5 rounded flex-row items-center mt-1">
                        <CheckCircle2 size={10} color="#10B981" />
                        <Text className="text-emerald-700 text-[9px] font-bold ml-1 uppercase">Selesai</Text>
                    </View>
                ) : (
                    <View className="bg-orange-100 px-2 py-0.5 rounded mt-1">
                        <Text className="text-orange-700 text-[10px] font-bold uppercase">AKTIF</Text>
                    </View>
                )}
            </View>

            {/* Main Info Area */}
            <View className="flex-1 justify-center">
                <Text className="text-slate-800 text-[18px] font-bold tracking-tight mb-0.5">
                    {container.plateNumber}
                </Text>
                <Text className="text-slate-500 text-[13px] font-medium mb-2">
                    {container.driverName} • {container.cargo}
                </Text>

                <View className="flex-row items-center space-x-3 gap-3">
                    <View className="flex-row items-center">
                        <Clock size={12} color="#94a3b8" />
                        <Text className="text-slate-500 text-[12px] font-medium ml-1">
                            Masuk: {formatTime(container.checkInTime)}
                        </Text>
                    </View>

                    {container.status === 'OUT' && (
                        <View className="flex-row items-center">
                            <Clock size={12} color="#10B981" />
                            <Text className="text-emerald-600 text-[12px] font-medium ml-1">
                                Keluar: {formatTime(container.checkOutTime)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Button - Only show if actively IN */}
                {container.status === 'IN' && (
                    <TouchableOpacity
                        className="mt-3 py-2 px-4 rounded-xl border border-orange-500 flex-row justify-center items-center"
                        activeOpacity={0.7}
                        onPress={handleCheckout}
                    >
                        <Text className="text-orange-600 font-bold text-[13px] tracking-wide">
                            CHECK OUT
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
