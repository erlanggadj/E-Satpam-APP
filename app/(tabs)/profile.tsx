import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { BellRing, ChevronRight, LogOut, Settings, ShieldAlert } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
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
                            source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAowMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAAAQIDBQYHBAj/xAA4EAABAwIEAggGAAQHAAAAAAABAAIDBBEFBhIhMUEHEyIzUWFxsRQygZGhwSNCUuEVU2OCotHx/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAIBAwQF/8QAIBEBAQACAgICAwAAAAAAAAAAAAECEQMxEiEEQSIyM//aAAwDAQACEQMRAD8AzpSTKS9TzgqtTKjZZQBSSCFGm7NMJIC3TKaAN001oVrJKSE2I2SspWSQFlW8XFlYVByzREWhWhVt4qwKoBNJNaL4u7CERd2EIKCkmUkCcoqTlEpQJpBOykF0wgBMBaGE+SWw3OwHNaDjeN4pmCskw7LYd8PH2ZJmmxefXkPdRllJ2rHG1uNXjWGUbtNTWwMfzaHXI9QOCKTGcMrX6Kauge88GarH7Fcylyvi+GwukqrOPHSB+1iWvOoceNwfBZjZl0q8dnbuKiVz7Kea5oJo6LEpddO82bK7jGeXqPZdBdY8OCtFmiuq3FTIVbgt0w2lWhVNVo4LQJpJoL4u7CERd2EIKChBSQIqJUnKJQDVJJqmgQTCLIAWDWs+1z6XBRTwOtLWSCEG9rA8fws9kfC8PosJjipZYpOb3MIJc7mSsHmOimxDMODQQND+rEsxBG3ZAA/LgsnQQVzKlzqijp4yHAMli2c7xuF5OfL3p6+DH1ttdXQQ1UDontbYjYnkuE5twt2E4zLD/I7tN8F13MOqI3+Fkqmht9AeQT5DzXP+kCma6joa5mGzUTydLg835eqjiy1XTlx3GlNO3iut5Pqn1eWqCWQlztDmEnidLiP0uRF1iuvZPp3U2V8NY4WJi1n/AHEn9r2x48mVcq3K0hVuVxBNVo4KpoVjUDTSTWC+LuwhEXdhCCgpJlJAnKKna6idkobVJQaprGmEwkEwmmPO0iLHKScjbqnsv4G4KyDsRa6vYZWuMYvp0tvusbikzqajdVMZr6kh7mgXOkcfxv52slSwy1EnxVFPI2OUagG7jdeL5Esy29/xrvHTZaeaGqILm9g8C5pG/hutb6W4oBkyQ2Gpk0RbbzcB+1lhBV6GdfVamt3I0AflaN0uY7G+gpsJgdqmdIJZR4NA2v8AW32XLj3cvTpyakrmBdckDfxXa8uPbJl3DiyTWBTRjV5hoB9lxBrmsve4vwHNdgyEYRlmnbDUNmIc4vsPkJN9K+hi+fmzpUCFY5VkrpEIgqbSoc1JqUTTSTWC+LuwhEXdhCCgpJlJAKJUjwUEobVMKDVNIGmEkwgJYxNC+IjsvaWlcuy/nLEcqGXC6iL4mKne5jbuILbbW9Ft2bs0x4NCaaiLZsRfsyMC+gngT5+AWqOyDmCspZ8RrjarOp72SAgv2vsdt+Oy5cmPm6cduL2Yr0nYjVQ6KSlip7j5nu1EfpaVNPPVSvmqJDJJIbue7clbjhfRVmOthZO8U1OHHstlc4vt42A2WAxzCY8IxN1E2vjrJYhaV0TbMa7wHipxwmPS7naxtNRCrqGwufoe/aNzhtq5A+A4/hZrJOMPwjGGMnJbTTnqpmk/KeR+h9ysSbNud78lRIHPawMdYs2J/q5qvtP07w/y3CrWOyvX/wCJYDSTkgyBuiQX3DgbH2WSIXaVyQPFSakUwlEwmkE1gvi7sIRF3YQgoKSZSQBUFJyigbVMKDVIJoTWqZ6zK7CYRRUL7Vkzbl9u7Z4+pW1t4rjOban43M+ISg6mtlMbPRvZ/RKzL1FYzdZ7o0y3PmDGXYgX3NI8OJcb2eT85vxsNwOZA5XXeZqKGON0jNzYXkcbn6nw5rnHQY5kOB4oHRSfxKltngdk9m1r+637FK1lFSyvlkEbLWLjyHH2UyVbGdJmZhl3KobTSBtdWt6qIsO4Fu076e5XznGLHcrNZsxx2P4u6p7fw8Y6uma87tZ/fisLIbNU9CmaVxcGt3J4K+JobtxPioQ21udb5eaI3a3+XNZsrK4TilXhVQJ6OS39TD8rx4ELq2GVseI0ENXD8kjb28DzC47GdTT5Lc+jmtcJqqgeewR1rB4Hgf0rlTY3c8UwkeKk1XUGmkmgvi7sIRF3YQgoKSZSQFrpWTQgAFIJBMLRIXA2XDqalkxDG2UjLmWoqtFxud3W/d13LUGi7tgNySuUZHqqWDP1JVVDA6FtVI9rb7X7Wn82+yjNWD6FwHA6PAcFpsNoG2jpwdTiN3v4lx8ySuZdMOYepYzB4CWzTs1TgHZsZOw9XW+wXSsSxdkNFNO9zWQMYXvcCdgBf2XzRjeKTYxi1TiNQ4l87y6x/lHIfaynqLeQKtwMjttgFIdo2v6qTnaB4BYIkBsL7cwqKY/w9+fsrpHAtO/FeSN1ow0cb2U1sZOm7UbnHx2WfyXJ1WZYB/mMcz8X/SwdK20WlZHApvh8ew+T/Xa0/Xb9q4l1Zw7SklzUl0rmE0k0F8XdhCIu7CEFBSTKSATSQtDCkohMLWVg88YicNy3UyMNpZbQs9Xcfxc/RcswNwjxSlcRfRK3bxW/dKckH+BU8L32ndUB8TfEAEE+liuf4K0PxGnYSQDK0EjiFyt/N0xnp2DpFxJlNkRxieBJVlsAAPFrrX29L/dcWub2HFbx0o1jizBqPUOzT9e4A8CeyPZy0aMWJJ4lZyX8tKx6WizbW4JPPjwQUDcWUKUE2uORCopt5QDwBXonaQw2C8TSWu2234rBn4jYHayZkMTmSt+Zjw4eo3VFLMJdr9pTm2YfVdJU12prg8BzeDhcKS8eDy9dhVHJ4ws9l7F1+nIJpJrBfF3YQiLuwhBQUkykgEIQtDaoT1DKWEyvDnWFw1gJc4+ACmqpJGMq2DmGH8n+ynky8Mdq48fLLTiWYsVqsSxSWSsc8PDyBG7bqxf5bclVhztNZEb27Y3+q7PjuV8LxunHxkDWTvH8OoZs8ed+a4/idDJgmN1FDM4SPpnjtDg4cQfsV5cOSZV6M+O4slnicT5mlja4FlNBDELeTAT/AMnOWEB3Wbw3LGO49NNWmn6oTOLtc3Zv6DioZhyzWYBNBFWvY4zM1scy9hbiN+arzlqfGyMQSkDurRCLfMShsLL7Ak+ZVJVyPGmzv/V4uqOuxabFZF1Ox0l3t4DayqfHpcHc2uH2SwlVsidEQ9p3byXveQYr3uDuvJKHNvxcOY5pRTFo0ntxnm3iPULR17J03XZdpDe+lpZ9iQs2tZ6PnXy8wDgJX/krZl2nTlewmkmjF8XdhCIu7CEFBSQhAIQhbBIbkBYOue5uYmNB7LqRpI8w93/aELj8j+brwf0e/NNTLS4dhUsJs41jGHzBBuFgJ8KpK3PMFTUMLnindJa+xc02F/omheHHp777bnTgNY7SLbrTelyzqLDZCBqD3Nv5W/shCzj/AHjOX9XN28Em/Mmhe14qsHG/kqnOu6xAQhaRA/O5eeRmk6mktPkhCwdU6ODqyxE48TK+/wBytoQhdsenK9hNJC1j0Rd2EIQg/9k=' }}
                            className="w-16 h-16 rounded-full bg-gray-200"
                        />
                        {/* Online Indicator */}
                        <View className="absolute bottom-0 right-0 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-[#0f172a] text-[18px] font-bold tracking-tight mb-1">
                            {user?.name || 'Loading...'}
                        </Text>
                        <Text className="text-gray-500 text-[13px] font-medium mb-2">
                            {user?.jabatan || 'Anggota Satpam'}
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
