import { ChevronRight, Clock } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

export function DailyBriefingCard() {
    return (
        <View
            className="bg-white rounded-[24px] p-5 shadow-sm drop-shadow-md mb-8 border border-gray-50/50"
            style={{
                shadowColor: "#94a3b8",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 6,
            }}
        >
            {/* Top row */}
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                    <Clock size={14} color="#f91616ff" strokeWidth={2.5} className="mr-1.5" />
                    <Text className="text-[#64748b] text-[11px] font-bold tracking-widest uppercase">08:00 AM SHIFT</Text>
                </View>
                <View className="bg-[#ea580c] px-2.5 py-1 rounded-full">
                    <Text className="text-white text-[9px] font-bold uppercase tracking-wide">URGENT</Text>
                </View>
            </View>

            <Text className="text-[#0f172a] text-[17px] font-bold tracking-tight mb-2.5">Daily Brifing</Text>
            <Text className="text-[#64748b] text-[13px] leading-[22px] font-medium mb-5">
                Ensure all vehicle identification tags are visible and scanned for the incoming GGF warehouse shipment. Verify ID for all truck drivers.
            </Text>

            <View className="h-[1px] bg-slate-100 w-full mb-5" />

            <View className="flex-row items-center justify-between">
                {/* Overlapping Faces */}
                <View className="flex-row items-center">
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' }} className="w-7 h-7 rounded-full border-[1.5px] border-white z-30 bg-gray-200" />
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop' }} className="w-7 h-7 rounded-full border-[1.5px] border-white z-20 -ml-2 bg-gray-300" />
                    <View className="w-7 h-7 rounded-full border-[1.5px] border-white -ml-2 z-10 bg-[#f1f5f9] flex items-center justify-center">
                        <Text className="text-[9px] font-bold text-[#64748b] tracking-tighter">+4</Text>
                    </View>
                </View>

                {/* View Details Link */}
                <View className="flex-row items-center">
                    <Text className="text-[#ea580c] text-[12px] font-bold mr-1">View Details</Text>
                    <ChevronRight size={14} color="#ea580c" strokeWidth={3} />
                </View>
            </View>
        </View>
    );
}
