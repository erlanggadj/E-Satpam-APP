import { Link } from 'expo-router';
import {
  Bell,
  Power,
  Shield,
} from 'lucide-react-native';
import React from 'react';
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyBriefingCard } from '@/components/features/DailyBriefingCard';
import { MODULES } from '@/constants/MockData';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const nameSatpam = 'Erlanggs Dj';

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-[#F9FAFB]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
      >
        {/* === HEADER SECTION === */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop' }}
          className="w-full pt-14 pb-20 px-5 relative"
        >
          {/* Dark Overlay for Architectural Image - blur-sm effect on the image itself usually requires heavy lifting so an overlay works best */}
          <View className="absolute inset-0 bg-[#0f172a]/70" />

          <View className="relative z-10 w-full">
            {/* Top Nav: Shield Icon, Text, Bell */}
            <View className="flex-row items-center justify-between mb-8">
              <View className="flex-row items-center">
                <View className="w-[42px] h-[46px] bg-[#F97316] rounded-xl flex items-center justify-center mr-3">
                  <Shield size={22} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View>
                  <Text className="text-white text-[19px] font-bold tracking-tight">GGF Security</Text>
                  <Text className="text-[#F97316] text-[9px] font-bold tracking-[1.5px] mt-0.5">COMMAND CENTER</Text>
                </View>
              </View>
              {/* Notification Bell */}
              <View className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20 relative">
                <Bell size={18} color="#FFFFFF" strokeWidth={2} />
                <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white/20" />
              </View>
            </View>

            {/* Profile Glassmorphism Card */}
            <View className="bg-white/20 rounded-3xl pt-3 pb-3 pl-3 pr-4 flex-row items-center border border-white/30 shadow-lg">
              <View className="relative mr-4">
                <Image
                  source={{ uri: 'https://avatars.githubusercontent.com/u/83545747?s=96&v=4' }}
                  className="w-[52px] h-[52px] rounded-[18px] bg-gray-300"
                />
                <View className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-[#10B981] rounded-full border-2 border-[#3f4b52]" />
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-white text-[15px] font-bold tracking-wide">{nameSatpam}</Text>
                <Text className="text-gray-300 text-[11px] font-medium mb-1.5">Kepala Satpam</Text>
                <View className="flex-row items-center">
                  <View className="bg-[#F97316] px-[6px] py-[2px] rounded-md mr-2">
                    <Text className="text-[#3b1704] text-[9px] font-bold">ONLINE</Text>
                  </View>
                  <Text className="text-gray-400 text-[10px] font-medium">ID: 992-GGF</Text>
                </View>
              </View>

              <View className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-white/10">
                <Power size={18} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* === MAIN CONTENT CONTAINER === */}
        <View className="-mt-6 bg-[#F1F5F9] rounded-t-[24px] pt-8 px-6 pb-[120px] flex-1 relative z-20">

          {/* Section: Digital Forms */}
          <View className="flex-row items-center justify-between mb-10">
            <View className="flex-row items-center">
              <View className="w-1 h-5 bg-[#F97316] rounded-full mr-3" />
              <Text className="text-[#0f172a] text-[18px] font-bold tracking-tight">Digital Forms</Text>
            </View>
            <Text className="text-[#F97316] text-[11px] font-bold tracking-widest">SHOW ALL</Text>
          </View>

          {/* 3-Column Grid for forms with more side padding */}
          <View className="flex-row flex-wrap gap-y-6 px-2" style={{ columnGap: '8%' }}>
            {MODULES.map((item) => {
              const Icon = item.icon;
              const iconColors: Record<string, string> = {
                'mutasi': '#F59E0B',
                'tamu': '#10B981',
                'kejadian': '#F43F5E',
                'keylog': '#8B5CF6',
                'piket': '#3B82F6',
                'container': '#F97316',
                'afkir': '#64748B',
                'izin': '#06B6D4',
              };
              const color = iconColors[item.id] || '#64748B';

              return (
                <Link href={`/modules/${item.id}`} asChild key={item.id}>
                  <Pressable className="w-[28%] items-center mb-4">
                    {({ pressed }) => (
                      <>
                        <View
                          className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm mb-2"
                          style={{
                            opacity: pressed ? 0.6 : 1,
                            shadowColor: "#94a3b8",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 3
                          }}
                        >
                          <Icon size={32} color={color} strokeWidth={2} />
                        </View>
                        <Text className="text-center font-bold text-[11px] text-[#334155] leading-tight px-1">
                          {item.title}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </Link>
              );
            })}
          </View>

          {/* Section: Daily Briefing */}
          <View className="flex-row items-center justify-between mt-10 mb-5">
            <View className="flex-row items-center">
              <View className="w-1 h-5 bg-[#F97316] rounded-full mr-3" />
              <Text className="text-[#0f172a] text-[18px] font-bold tracking-tight">Daily Briefing</Text>
            </View>
            <Text className="text-[#F97316] text-[11px] font-bold tracking-widest">ARCHIVE</Text>
          </View>

          {/* Daily Briefing Card Component */}
          <DailyBriefingCard />

        </View>
      </ScrollView>
    </View>
  );
}
