import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Fingerprint, Lock, Mail, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-[#0a1128]" edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Light status bar for dark background */}
            <StatusBar style="light" />

            {/* Abstract Circuit/Tech Background Overlay (Simulated via tailwind borders/absolute views) */}
            <View className="absolute inset-0 opacity-10 pointer-events-none">
                <View className="absolute top-10 right-0 w-32 h-[500px] border-r border-[#ea580c]" />
                <View className="absolute top-20 right-5 w-20 h-40 border-r border-t border-[#ea580c] rounded-tr-3xl" />
                <View className="absolute bottom-10 left-0 w-40 h-[400px] border-l border-[#ea580c]" />
                <View className="absolute bottom-20 left-10 w-20 h-40 border-l border-b border-[#ea580c] rounded-bl-3xl" />
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* LOGO & TITLE SECTION */}
                <View className="items-center mb-12">
                    {/* Logo Placeholder */}
                    <View className="flex-row items-center justify-center mb-6">
                        <View
                            className="mr-3 p-3 rounded-2xl flex items-center justify-center"
                            style={{
                                shadowColor: "#ea580c",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 15,
                                elevation: 10,
                                borderWidth: 1.5,
                                borderColor: '#ea580c',
                                backgroundColor: 'rgba(234, 88, 12, 0.1)'
                            }}
                        >
                            <Shield size={36} color="#ea580c" strokeWidth={2} />
                        </View>
                        <Text
                            className="text-[#ea580c] text-3xl font-bold tracking-widest"
                            style={{
                                textShadowColor: 'rgba(234, 88, 12, 0.6)',
                                textShadowOffset: { width: 0, height: 0 },
                                textShadowRadius: 10,
                            }}
                        >
                            GGF SECURITY
                        </Text>
                    </View>

                    <Text className="text-white text-3xl font-bold tracking-tight mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-gray-400 text-base font-medium tracking-wide">
                        Cyber-Tech Professional
                    </Text>
                </View>

                {/* INPUT FIELDS (Glassmorphism + Glowing Borders) */}
                <View className="space-y-4 mb-6 mt-12">
                    {/* Email Input */}
                    <View
                        className="flex-row items-center w-full h-[58px] bg-[#ffffff08] rounded-2xl px-4 border"
                        style={{ borderColor: 'rgba(234, 88, 12, 0.4)' }}
                    >
                        <Mail size={20} color="#ea580c" className="mr-3" />
                        <TextInput
                            className="flex-1 text-[#ea580c] text-[15px] h-full font-medium"
                            placeholder="Email Address"
                            placeholderTextColor="rgba(234, 88, 12, 0.5)"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            cursorColor="#ea580c"
                        />
                    </View>

                    {/* Password Input */}
                    <View
                        className="flex-row items-center w-full h-[58px] bg-[#ffffff08] rounded-2xl px-4 border mt-4 mb-1"
                        style={{ borderColor: 'rgba(234, 88, 12, 0.4)' }}
                    >
                        <Lock size={20} color="#ea580c" className="mr-3" />
                        <TextInput
                            className="flex-1 text-[#ea580c] text-[15px] h-full font-medium"
                            placeholder="Password"
                            placeholderTextColor="rgba(234, 88, 12, 0.5)"
                            secureTextEntry={!showPassword}
                            cursorColor="#ea580c"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-3">
                            {showPassword ? (
                                <Eye size={20} color="rgba(234, 88, 12, 0.7)" />
                            ) : (
                                <EyeOff size={20} color="rgba(234, 88, 12, 0.7)" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* REMEMBER ME & FORGOT PASSWORD */}
                <View className="flex flex-row justify-between items-center mb-10 w-full px-1">
                    <TouchableOpacity
                        className="flex-row items-center"
                        activeOpacity={0.8}
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        {/* Custom Glowing Toggle */}
                        <View
                            className={`w-11 h-6 rounded-full flex justify-center px-1 mr-2.5 ${rememberMe ? 'bg-[#ea580c]' : 'bg-[#1e293b]'}`}
                            style={rememberMe ? {
                                shadowColor: "#ea580c",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 10,
                                elevation: 5,
                            } : {}}
                        >
                            <View
                                className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm ${rememberMe ? 'ml-auto' : 'ml-0'}`}
                            />
                        </View>
                        <Text className="text-gray-200 text-[14px] font-medium">Remember Me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7}>
                        <Text className="text-[#ea580c] text-[14px] font-medium">Forgot?</Text>
                    </TouchableOpacity>
                </View>

                {/* ACTION BUTTONS */}
                <View className="w-full">
                    <TouchableOpacity
                        className="w-full h-[58px] rounded-2xl bg-[#ea580c] flex items-center justify-center mb-4"
                        activeOpacity={0.8}
                        onPress={() => router.replace('/(tabs)')}
                        style={{
                            shadowColor: "#ea580c",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.6,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <Text className="text-white text-[16px] font-bold tracking-wide">
                            Access Dashboard
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full h-[58px] rounded-2xl bg-[#0a1128] border-2 border-[#ea580c]/80 flex-row items-center justify-center mt-1"
                        activeOpacity={0.7}
                    >
                        <Fingerprint size={22} color="#ea580c" className="mr-2" />
                        <Text className="text-white text-[15px] font-bold tracking-wide">
                            Biometric Login
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* BOTTOM FOOTER TEXT */}
                <View className="mt-14 items-center">
                    <Text className="text-white text-[11px] font-bold tracking-[0.15em] mb-1.5">
                        AUTHORIZED <Text className="text-[#ea580c]">PERSONNEL</Text> ONLY...
                    </Text>
                    <Text className="text-gray-400 text-[9px] text-center max-w-[260px] leading-[14px] opacity-70">
                        The identity has been within a theme for door enquired and slitient for your theme.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
