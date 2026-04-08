import React from 'react';
import { View } from 'react-native';

export function ModuleIcon({ id }: { id: string }) {
    if (id === 'mutasi') return (
        <View className="w-10 h-10 relative items-center justify-center">
            <View className="absolute w-8 h-8 rounded-lg bg-[#F59E0B] opacity-90 rotate-12" />
            <View className="absolute w-8 h-8 rounded-lg bg-[#FCD34D] shadow-sm flex items-center justify-center -rotate-6">
                <View className="w-4 h-0.5 bg-yellow-700/50 mb-1" />
                <View className="w-5 h-0.5 bg-yellow-700/50" />
            </View>
        </View>
    );
    if (id === 'tamu') return (
        <View className="w-10 h-10 relative items-center justify-center">
            <View className="absolute w-9 h-6 rounded-md bg-[#EF4444] top-1.5 opacity-90 shadow-sm" />
            <View className="absolute w-9 h-6 rounded-md bg-white border border-gray-100 flex-row items-center p-1 -bottom-0.5 shadow-sm">
                <View className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 mr-1" />
                <View className="flex-1 space-y-0.5">
                    <View className="w-full h-0.5 bg-gray-200" />
                    <View className="w-2 h-0.5 bg-gray-200" />
                </View>
            </View>
        </View>
    );
    if (id === 'kejadian') return (
        <View className="w-10 h-10 relative flex items-center justify-center">
            <View className="w-9 h-10 bg-[#fde047] rounded-sm absolute opacity-80" />
            <View className="w-8 h-10 bg-[#ca8a04] shadow-sm transform -translate-x-1 translate-y-1">
                <View className="w-full h-2 bg-yellow-800/20 mt-2" />
                <View className="w-full h-2 bg-yellow-800/20 mt-1" />
            </View>
        </View>
    );
    if (id === 'keylog') return (
        <View className="w-10 h-10 relative items-center justify-center">
            <View className="w-7 h-9 bg-[#EF4444] rounded-t-lg absolute z-10 shadow-sm flex items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-red-800/40 absolute -right-1 top-1" />
            </View>
            <View className="w-9 h-10 bg-red-300/50 rounded-lg absolute translate-x-1" />
        </View>
    );
    if (id === 'piket') return (
        <View className="w-10 h-10 relative items-center justify-center">
            <View className="w-6 h-6 bg-[#3B82F6] rounded-full absolute right-0 bottom-1" />
            <View className="w-7 h-7 bg-[#10B981] rounded-full absolute z-10" />
            <View className="w-6 h-6 bg-[#F59E0B] rounded-full absolute left-0 bottom-1" />
        </View>
    );
    if (id === 'container') return (
        <View className="w-10 h-10 relative items-center justify-center">
            <View className="w-8 h-6 bg-[#DC2626] rounded-[3px] relative shadow-sm rotate-45 transform">
                <View className="w-3 h-3 rounded-full bg-red-900 absolute top-1 left-1" />
                <View className="w-3 h-8 bg-[#991B1B] absolute -right-2 top-0 rounded-r-[3px] shadow-md" />
            </View>
        </View>
    );
    if (id === 'afkir') return (
        <View className="w-10 h-10 relative items-center justify-center">
            <View className="w-8 h-9 bg-gray-200 rounded-sm shadow-sm absolute border border-gray-300">
                <View className="w-full h-1 bg-gray-300 mt-2" />
                <View className="w-full h-1 bg-gray-300 mt-1" />
            </View>
            <View className="w-6 h-6 bg-white rounded-full absolute -bottom-1 -right-1 shadow-sm border border-gray-100 flex items-center justify-center">
                <View className="w-2.5 h-0.5 bg-[#475569] rotate-45 rounded-full" />
            </View>
        </View>
    );
    if (id === 'izin') return (
        <View className="w-10 h-10 relative flex items-center justify-center gap-1.5 flex-row">
            <View className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <View className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <View className="w-2.5 h-2.5 rounded-full bg-slate-400" />
        </View>
    );

    return null;
}
