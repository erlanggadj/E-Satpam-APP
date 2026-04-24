import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFocusEffect, useRouter } from 'expo-router';
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Filter,
    Key,
    Search,
    Truck,
    User,
    X
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEMS_PER_PAGE = 15;

export default function GlobalHistoryScreen() {
    const router = useRouter();

    const { user } = useAuthStore();
    const canApprove = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.jabatan === 'KAPAMWIL';

    // State
    const [allData, setAllData] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [activeValidation, setActiveValidation] = useState<'ALL' | 'PENDING' | 'VALIDATED'>('ALL');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedDate, setSelectedDate] = useState('Hari Ini');

    // Fetch from real API
    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/history?limit=100');
            if (res.data?.data) {
                setAllData(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    // Filter Logic
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const isItemValidated = item.status === 'APPROVED';
            const itemValidationStatus = isItemValidated ? 'VALIDATED' : 'PENDING';
            const matchValidation = activeValidation === 'ALL' || itemValidationStatus === activeValidation;
            const matchSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.module || '').toLowerCase().includes(searchQuery.toLowerCase());

            // Category filter logic can be extended here if needed based on selectedCategory
            const matchCategory = selectedCategory === 'Semua' || (item.module && item.module.toLowerCase().includes(selectedCategory.toLowerCase()));

            return matchValidation && matchSearch && matchCategory;
        });
    }, [allData, activeValidation, searchQuery, selectedCategory]);

    // Initial Load & Filter Change
    React.useEffect(() => {
        setPage(1);
        setDisplayData(filteredData.slice(0, ITEMS_PER_PAGE));
    }, [filteredData]);

    const loadMoreData = () => {
        if (isLoadingMore || displayData.length >= filteredData.length) return;

        setIsLoadingMore(true);
        setTimeout(() => {
            const nextPage = page + 1;
            const newItems = filteredData.slice(0, nextPage * ITEMS_PER_PAGE);
            setDisplayData(newItems);
            setPage(nextPage);
            setIsLoadingMore(false);
        }, 800);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    };

    const formatTime = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    };

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getIconInfo = (moduleName: string) => {
        switch (moduleName) {
            case 'container': return { icon: Truck, color: '#f59e0b', bg: 'bg-amber-100', name: 'Kontainer' };
            case 'keylog': return { icon: Key, color: '#3b82f6', bg: 'bg-blue-100', name: 'Kunci' };
            case 'tamu': return { icon: User, color: '#10b981', bg: 'bg-emerald-100', name: 'Tamu' };
            default: return { icon: FileText, color: '#6366f1', bg: 'bg-indigo-100', name: moduleName || 'Modul' };
        }
    };

    const handleCardPress = (item: any) => {
        switch (item.module) {
            case 'mutasi':
                router.push({ pathname: `/modules/mutasi/${item.id}/detail` as any, params: { source: 'history', title: item.title } });
                break;
            case 'keylog':
                router.push({ pathname: `/modules/keylog/${item.id}/detail` as any, params: { source: 'history', title: item.title } });
                break;
            case 'tamu':
                router.push({ pathname: `/modules/tamu/detail`, params: { itemId: item.id, source: 'history', title: item.title } } as any);
                break;
            default:
                router.push({ pathname: `/modules/${item.module}/${item.id}/detail` as any, params: { source: 'history', title: item.title } });
                break;
        }
    };

    const renderCompactCard = ({ item }: { item: any }) => {
        const { icon: Icon, color, bg, name } = getIconInfo(item.module);
        const isPending = item.status !== 'APPROVED';

        return (
            <TouchableOpacity
                className={`px-4 py-3 mb-2 rounded-xl border flex-row items-center shadow-sm bg-white border-gray-100`}
                onPress={() => handleCardPress(item)}
                activeOpacity={0.7}
            >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bg}`}>
                    <Icon size={20} color={color} />
                </View>

                <View className="flex-1 justify-center">
                    <Text className="text-slate-800 text-[14px] font-bold tracking-tight mb-0.5" numberOfLines={1}>
                        {item.title || 'Tidak Ada Judul'}
                    </Text>
                    <Text className="text-slate-500 text-[11px] font-medium uppercase">
                        {name} • {formatDate(item.createdAt)} {formatTime(item.createdAt)}
                    </Text>
                </View>

                <View className="ml-2 flex-row items-center justify-end">
                    {isPending ? (
                        <View className="bg-orange-50 border border-orange-200 px-2 py-1 rounded flex-row items-center mr-2">
                            <Clock size={10} color="#ea580c" className="mr-1" />
                            <Text className="text-orange-700 text-[9px] font-bold uppercase tracking-widest">Proses</Text>
                        </View>
                    ) : (
                        <View className="bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex-row items-center mr-2">
                            <CheckCircle2 size={10} color="#10b981" className="mr-1" />
                            <Text className="text-emerald-700 text-[9px] font-bold uppercase tracking-widest">Validated</Text>
                        </View>
                    )}
                    <ChevronRight size={16} color="#cbd5e1" />
                </View>
            </TouchableOpacity>
        );
    };

    const renderFilterModal = () => (
        <Modal
            transparent={true}
            visible={isFilterModalVisible}
            animationType="slide"
            onRequestClose={() => setFilterModalVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl pt-2 pb-8 px-6">
                    <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />

                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-[18px] font-bold text-slate-800">Filter Riwayat</Text>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)} className="p-2 -mr-2 bg-gray-100 rounded-full">
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3 ml-1">Kategori</Text>
                    <View className="space-y-4 mb-8 px-1">
                        {['Semua', 'Lembar Mutasi', 'Kontainer', 'Tamu', 'Kunci'].map(cat => (
                            <TouchableOpacity
                                key={cat}
                                className="flex-row items-center"
                                activeOpacity={0.7}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <View className={`w-5 h-5 rounded mr-3 items-center justify-center border ${selectedCategory === cat ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                    {selectedCategory === cat && <CheckCircle2 size={12} color="#fff" strokeWidth={3} />}
                                </View>
                                <Text className="text-[15px] text-slate-700 font-medium">{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-3 ml-1">Rentang Waktu</Text>
                    <View className="space-y-4 mb-10 px-1">
                        {['Hari Ini', '7 Hari Terakhir', 'Pilih Tanggal Spesifik'].map(time => (
                            <TouchableOpacity
                                key={time}
                                className="flex-row items-center"
                                activeOpacity={0.7}
                                onPress={() => setSelectedDate(time)}
                            >
                                <View className={`w-5 h-5 rounded-full mr-3 items-center justify-center border ${selectedDate === time ? 'border-primary' : 'border-gray-300'}`}>
                                    {selectedDate === time && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </View>
                                <Text className="text-[15px] text-slate-700 font-medium">{time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        className="bg-primary py-4 rounded-xl items-center shadow-sm"
                        onPress={() => setFilterModalVisible(false)}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold tracking-wide">TERAPKAN FILTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const pendingCount = useMemo(() => allData.filter(i => i.status !== 'APPROVED').length, [allData]);
    const todayCount = useMemo(() => {
        const todayStr = new Date().toDateString();
        return allData.filter(i => new Date(i.createdAt).toDateString() === todayStr).length;
    }, [allData]);

    const renderSkeleton = () => (
        <View className="px-4 py-3 mb-2 rounded-xl border border-gray-100 flex-row items-center bg-white opacity-60">
            <View className="w-10 h-10 rounded-full bg-slate-200 mr-3" />
            <View className="flex-1 justify-center">
                <View className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <View className="h-3 bg-slate-200 rounded w-1/2" />
            </View>
            <View className="ml-2 w-16 h-6 bg-slate-200 rounded" />
        </View>
    );

    const renderSkeletons = () => (
        <View className="pt-2">
            {Array.from({ length: 8 }).map((_, i) => <View key={`skel-${i}`}>{renderSkeleton()}</View>)}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            {/* Top Header */}
            <View className="bg-white px-5 pt-4 pb-5 border-b border-gray-100 shadow-sm z-10">
                <View className="flex-row justify-between items-center mb-5">
                    <Text className="text-[22px] font-bold text-slate-800 tracking-tight">Activity History</Text>
                    <TouchableOpacity
                        className="bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex-row items-center"
                    >
                        <User size={12} color="#64748b" className="mr-1.5" />
                        <Text className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">
                            View: {user?.jabatan || 'Anggota'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row space-x-3 gap-3">
                    <View className="flex-1 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                        <Text className="text-slate-800 text-[20px] font-black">{todayCount}</Text>
                        <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Logs Today</Text>
                    </View>
                    <View className="flex-1 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                        <Text className="text-slate-800 text-[20px] font-black">{pendingCount}</Text>
                        <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Pending Valid.</Text>
                    </View>
                </View>
            </View>

            {/* Search & Filter Row */}
            <View className="px-5 py-4 flex-row items-center bg-white border-b border-gray-100">
                <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl h-12 px-3 mr-3">
                    <Search size={18} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-2 text-slate-800 text-[14px]"
                        placeholder="Cari aktivitas..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity
                    className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl items-center justify-center active:bg-slate-100"
                    onPress={() => setFilterModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Filter size={20} color="#64748b" />
                </TouchableOpacity>
            </View>

            {/* Status Tabs */}
            <View className="bg-white border-b border-gray-200 shadow-sm z-10">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row py-3 pl-5"
                >
                    {['ALL', 'PENDING', 'VALIDATED'].map((status) => (
                        <TouchableOpacity
                            key={`stat-${status}`}
                            className={`px-4 py-1.5 rounded-full border mr-2 ${activeValidation === status ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                            onPress={() => setActiveValidation(status as any)}
                        >
                            <Text className={`text-[11px] font-bold tracking-widest uppercase ${activeValidation === status ? 'text-white' : 'text-slate-500'}`}>
                                {status === 'ALL' ? 'Semua Status' : status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <View className="w-4" />
                </ScrollView>
            </View>

            {isLoading && allData.length === 0 ? (
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {renderSkeletons()}
                </ScrollView>
            ) : (
                <FlatList
                    data={displayData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCompactCard}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isLoadingMore ? (
                            <View className="py-4 items-center justify-center">
                                <ActivityIndicator size="small" color="#94a3b8" />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View className="py-20 items-center justify-center">
                            <AlertCircle size={40} color="#cbd5e1" className="mb-4" />
                            <Text className="text-slate-400 font-bold text-[16px]">Data Tidak Ditemukan</Text>
                            <Text className="text-slate-400 text-[12px] mt-1">Coba ubah kata kunci atau filter Anda.</Text>
                        </View>
                    }
                />
            )}

            {renderFilterModal()}

        </SafeAreaView>
    );
}