import { SyncBadge } from '@/components/ui/SyncBadge';
import { ContainerRecord } from '@/store/useModuleStore';
import { useRouter } from 'expo-router';
import { ArrowRightCircle, CheckCircle2, Clock, Truck } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ContainerCardProps {
    container: ContainerRecord;
}

export function ContainerCard({ container }: ContainerCardProps) {
    const router = useRouter();
    const isNavigating = React.useRef(false);

    const handleDetailPress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/container/${container.id}/detail` as any);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const handleCheckoutPress = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;
        router.push(`/modules/container/${container.id}/keluar` as any);
        setTimeout(() => { isNavigating.current = false; }, 500);
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-gray-100 flex-row"
            activeOpacity={0.7}
            onPress={handleDetailPress}
        >
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
                    <View className="bg-orange-100 px-2 py-0.5 rounded mt-1 flex-row items-center">
                        <Clock size={10} color="#c2410c" />
                        <Text className="text-orange-700 text-[9px] font-bold ml-1 uppercase">Di Area</Text>
                    </View>
                )}
            </View>

            {/* Main Info Area */}
            <View className="flex-1 justify-center relative">
                <View className="flex-row justify-between items-start mb-0.5">
                    <Text className="text-slate-800 text-[18px] font-bold tracking-tight flex-1 mr-2" numberOfLines={1}>
                        {container.plateNumber}
                    </Text>
                    <SyncBadge status={container.sync_status || 0} business_status={container.status} moduleType="CONTAINER" />
                </View>
                <Text className="text-slate-500 text-[13px] font-medium mb-2">
                    {container.driverName} • {container.cargo}
                </Text>

                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <Clock size={12} color="#94a3b8" />
                        <Text className="text-slate-500 text-[11px] font-medium ml-1">
                            Masuk: {formatTime(container.checkInTime)}
                        </Text>
                    </View>

                    {container.status === 'OUT' && (
                        <View className="flex-row items-center">
                            <ArrowRightCircle size={12} color="#10B981" />
                            <Text className="text-emerald-600 text-[11px] font-medium ml-1">
                                Keluar: {formatTime(container.checkOutTime)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Button - Only show if actively IN. Nested logic is safe here. */}
                {container.status === 'IN' && (
                    <TouchableOpacity
                        className="mt-3 py-2.5 px-4 rounded-xl border border-orange-500 bg-orange-50 flex-row justify-center items-center active:bg-orange-100"
                        activeOpacity={0.8}
                        onPress={handleCheckoutPress}
                    >
                        <Text className="text-orange-600 font-bold text-[13px] tracking-wide uppercase">
                            Kendaraan Keluar
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}
