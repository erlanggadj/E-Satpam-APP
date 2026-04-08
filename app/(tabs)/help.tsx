import { Stack } from 'expo-router';
import {
    BadgeInfo,
    BookUser,
    Bug,
    ChevronRight,
    ClipboardEdit,
    FileCheck,
    HelpCircle,
    Key,
    MessageCircle,
    Phone,
    Recycle,
    Search,
    TriangleAlert,
    Truck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const help_categories = [
    { id: 'faq', title: 'FAQ Umum', icon: HelpCircle },
    { id: 'mutasi', title: 'Lembar Mutasi', icon: ClipboardEdit },
    { id: 'tamu', title: 'Buku Tamu', icon: BookUser },
    { id: 'kejadian', title: 'Log Kejadian', icon: TriangleAlert },
    { id: 'keylog', title: 'Log Kunci', icon: Key },
    { id: 'piket', title: 'Piket Staff', icon: BadgeInfo },
    { id: 'container', title: 'Log Kontainer', icon: Truck },
    { id: 'afkir', title: 'Log Afkir', icon: Recycle },
    { id: 'izin', title: 'Izin Staff', icon: FileCheck }
];

const getIconColor = (id: string) => {
    switch (id) {
        case 'faq': return { color: '#3b82f6', bgClass: 'bg-blue-50' };
        case 'mutasi': return { color: '#10b981', bgClass: 'bg-emerald-50' };
        case 'tamu': return { color: '#f59e0b', bgClass: 'bg-amber-50' };
        case 'kejadian': return { color: '#ef4444', bgClass: 'bg-red-50' };
        case 'keylog': return { color: '#8b5cf6', bgClass: 'bg-violet-50' };
        case 'piket': return { color: '#6366f1', bgClass: 'bg-indigo-50' };
        case 'container': return { color: '#f97316', bgClass: 'bg-orange-50' };
        case 'afkir': return { color: '#84cc16', bgClass: 'bg-lime-50' };
        case 'izin': return { color: '#06b6d4', bgClass: 'bg-cyan-50' };
        default: return { color: '#64748b', bgClass: 'bg-slate-50' };
    }
};

export default function HelpScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = help_categories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F1F5F9]" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Text */}
                <View className="px-6 pt-6 pb-4">
                    <Text className="text-[#0f172a] text-[22px] font-bold tracking-tight">Bantuan & Dukungan</Text>
                </View>

                {/* Search Bar */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl h-14 px-4 shadow-sm">
                        <Search size={20} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-3 text-slate-800 text-[15px]"
                            placeholder="Cari topik bantuan..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3 ml-1">
                        Kontak Darurat & IT
                    </Text>
                    <View className="flex-row justify-between space-x-3 gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 items-center justify-center flex-col shadow-sm"
                            activeOpacity={0.7}
                        >
                            <View className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                                <Phone size={22} color="#3b82f6" />
                            </View>
                            <Text className="text-slate-800 text-[13px] font-bold">Hubungi IT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 items-center justify-center flex-col shadow-sm"
                            activeOpacity={0.7}
                        >
                            <View className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                                <MessageCircle size={22} color="#10b981" />
                            </View>
                            <Text className="text-slate-800 text-[13px] font-bold">WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 items-center justify-center flex-col shadow-sm"
                            activeOpacity={0.7}
                        >
                            <View className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                                <Bug size={22} color="#f59e0b" />
                            </View>
                            <Text className="text-slate-800 text-[13px] font-bold">Lapor Bug</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories Section Label */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3 ml-1">
                        Kategori Bantuan
                    </Text>

                    {/* Grouped Categories List */}
                    <View className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                        {filteredCategories.length > 0 ? filteredCategories.map((category, index) => {
                            const { color, bgClass } = getIconColor(category.id);
                            const IconComponent = category.icon;

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    className={`flex-row items-center justify-between p-4 ${index !== filteredCategories.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${bgClass}`}>
                                            <IconComponent size={20} color={color} />
                                        </View>
                                        <Text className="text-[#334155] text-[15px] font-semibold flex-1">
                                            {category.title}
                                        </Text>
                                    </View>
                                    <ChevronRight size={20} color="#cbd5e1" />
                                </TouchableOpacity>
                            );
                        }) : (
                            <View className="p-6 items-center justify-center">
                                <Text className="text-slate-400 italic">Kategori tidak ditemukan.</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View className="items-center justify-center mt-4 pb-4">
                    <Text className="text-gray-400 font-bold text-[11px] tracking-widest uppercase">GGF Security v1.0.0</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
