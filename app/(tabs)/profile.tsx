import { useRouter } from 'expo-router';
import { BellRing, ChevronRight, LogOut, Settings, ShieldAlert } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleLogout = () => {
        // Clear navigation stack and redirect to login
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F1F5F9]" edges={['top']}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header Header */}
                <View className="px-6 pt-6 pb-4">
                    <Text className="text-[#0f172a] text-[22px] font-bold tracking-tight">Profil Pengguna</Text>
                </View>

                {/* Profile Card */}
                <View className="mx-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8 flex-row items-center">
                    <View className="relative mr-5">
                        <Image
                            source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQF69Rf1kliLFQ/profile-displayphoto-shrink_400_400/B56Za_MrJHH0Ag-/0/1746964493447?e=1775088000&v=beta&t=mnwwuD3nWeLotsMWmv4ApUyUtglLDp9GKmxQCBx90Dc' }}
                            className="w-16 h-16 rounded-full bg-gray-200"
                        />
                        {/* Online Indicator */}
                        <View className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-[#0f172a] text-[18px] font-bold tracking-tight mb-1">
                            ALIF BATANG
                        </Text>
                        <Text className="text-gray-500 text-[13px] font-medium mb-2">
                            Anggota Satpam
                        </Text>
                        <View className="flex-row items-center">
                            <View className="bg-[#10B981]/10 px-2 py-1 rounded-md">
                                <Text className="text-[#10B981] text-[10px] font-bold uppercase tracking-widest">ONLINE</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Settings & Info Section */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3 ml-1">
                        Pengaturan & Info
                    </Text>

                    <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Option 1 */}
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100" activeOpacity={0.7}>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3">
                                    <Settings size={20} color="#64748b" />
                                </View>
                                <Text className="text-[#334155] text-[15px] font-semibold">Pengaturan Akun</Text>
                            </View>
                            <ChevronRight size={20} color="#cbd5e1" />
                        </TouchableOpacity>

                        {/* Option 2 */}
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100" activeOpacity={0.7}>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                                    <BellRing size={20} color="#ea580c" />
                                </View>
                                <Text className="text-[#334155] text-[15px] font-semibold">Notifikasi</Text>
                            </View>
                            <ChevronRight size={20} color="#cbd5e1" />
                        </TouchableOpacity>

                        {/* Option 3 */}
                        <TouchableOpacity className="flex-row items-center justify-between p-4" activeOpacity={0.7}>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
                                    <ShieldAlert size={20} color="#ef4444" />
                                </View>
                                <Text className="text-[#334155] text-[15px] font-semibold">Kebijakan Privasi</Text>
                            </View>
                            <ChevronRight size={20} color="#cbd5e1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LOG OUT BUTTON */}
                <View className="px-6 mt-4">
                    <TouchableOpacity
                        className="w-full h-14 bg-red-500 border border-orange-100 rounded-2xl flex-row items-center justify-center shadow-sm"
                        activeOpacity={0.8}
                        onPress={handleLogout}
                        style={{ shadowColor: '#ef4444', shadowOpacity: 0.1, shadowRadius: 10 }}
                    >
                        <LogOut size={20} color="#ffffffff" strokeWidth={2.5} className="mr-2" />
                        <Text className="text-white font-bold text-[16px] tracking-wide ml-2">
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
