import { useRouter } from 'expo-router';
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Clock,
    Filter,
    Key,
    Search,
    Truck,
    User,
    X
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
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

// --- TYPES ---
type LogType = 'CONTAINER' | 'KEY' | 'VISITOR';
type LogStatus = 'COMPLETED' | 'CANCELLED';
type ValidationStatus = 'PENDING' | 'VALIDATED';
type UserRole = 'SECURITY' | 'MANAGER';

interface HistoryItem {
    id: string;
    type: LogType;
    title: string;
    description: string;
    timestamp: string;
    status: LogStatus;
    validationStatus: ValidationStatus;
    validatedBy?: string;
}

// --- MOCK DATA GENERATOR ---
const generateMockData = (): HistoryItem[] => {
    const items: HistoryItem[] = [];
    const types: LogType[] = ['CONTAINER', 'KEY', 'VISITOR'];
    const statuses: LogStatus[] = ['COMPLETED', 'CANCELLED'];

    const now = new Date();

    for (let i = 1; i <= 100; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const isPending = Math.random() > 0.6; // 40% chance pending

        const randomTimeOffsets = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
        const itemDate = new Date(now.getTime() - randomTimeOffsets);

        let title = '';
        let description = '';

        if (type === 'CONTAINER') {
            title = `Kontainer Keluar: BE ${Math.floor(Math.random() * 9000) + 1000} CD`;
            description = `Supir: Junaidi, Vendor: PT. Logistik Makmur`;
        } else if (type === 'KEY') {
            title = `Ambil Kunci: Ruang Server`;
            description = `Nama: Budi Santoso, Divisi: IT Maintenance`;
        } else {
            title = `Tamu Baru: Bapak Anton`;
            description = `Tujuan: Meeting Internal Direksi`;
        }

        items.push({
            id: `log-${String(i).padStart(4, '0')}`,
            type,
            title,
            description,
            timestamp: itemDate.toISOString(),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            validationStatus: isPending ? 'PENDING' : 'VALIDATED',
            validatedBy: isPending ? undefined : 'Manager Satpam',
        });
    }

    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const ITEMS_PER_PAGE = 15;
const ALL_MOCK_DATA = generateMockData();

export default function GlobalHistoryScreen() {
    const router = useRouter();

    // State
    const [userRole, setUserRole] = useState<UserRole>('SECURITY');
    const [allData, setAllData] = useState<HistoryItem[]>(ALL_MOCK_DATA);
    const [displayData, setDisplayData] = useState<HistoryItem[]>([]);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [activeValidation, setActiveValidation] = useState<'ALL' | ValidationStatus>('ALL');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedDate, setSelectedDate] = useState('Hari Ini');

    // Filter Logic
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const matchValidation = activeValidation === 'ALL' || item.validationStatus === activeValidation;
            const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchValidation && matchSearch;
        });
    }, [allData, activeValidation, searchQuery]);

    // Initial Load & Filter Change
    useEffect(() => {
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

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setPage(1);
            setDisplayData(filteredData.slice(0, ITEMS_PER_PAGE));
            setRefreshing(false);
        }, 1000);
    };

    const formatTime = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    };

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getIconInfo = (type: LogType) => {
        switch (type) {
            case 'CONTAINER': return { icon: Truck, color: '#f59e0b', bg: 'bg-amber-100' };
            case 'KEY': return { icon: Key, color: '#3b82f6', bg: 'bg-blue-100' };
            case 'VISITOR': return { icon: User, color: '#10b981', bg: 'bg-emerald-100' };
        }
    };

    const renderCompactCard = ({ item }: { item: HistoryItem }) => {
        const { icon: Icon, color, bg } = getIconInfo(item.type);
        const isPending = item.validationStatus === 'PENDING';

        return (
            <TouchableOpacity
                className="bg-white px-4 py-3 mb-2 rounded-xl border border-gray-100 flex-row items-center shadow-sm"
                onPress={() => router.push('/riwayat/detail')}
                activeOpacity={0.7}
            >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bg}`}>
                    <Icon size={20} color={color} />
                </View>

                <View className="flex-1 justify-center">
                    <Text className="text-slate-800 text-[14px] font-bold tracking-tight mb-0.5" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text className="text-slate-500 text-[11px] font-medium">
                        {formatDate(item.timestamp)} • {formatTime(item.timestamp)}
                    </Text>
                </View>

                <View className="ml-2 flex-row items-center justify-end">
                    {isPending ? (
                        <View className="bg-orange-50 border border-orange-200 px-2 py-1 rounded flex-row items-center mr-2">
                            <Clock size={10} color="#ea580c" className="mr-1" />
                            <Text className="text-orange-700 text-[9px] font-bold uppercase tracking-widest">Pending</Text>
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

    const pendingCount = useMemo(() => allData.filter(i => i.validationStatus === 'PENDING').length, [allData]);
    const todayCount = useMemo(() => {
        const todayStr = new Date().toDateString();
        return allData.filter(i => new Date(i.timestamp).toDateString() === todayStr).length;
    }, [allData]);

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            {/* Top Header */}
            <View className="bg-white px-5 pt-4 pb-5 border-b border-gray-100 shadow-sm z-10">
                <View className="flex-row justify-between items-center mb-5">
                    <Text className="text-[22px] font-bold text-slate-800 tracking-tight">Activity History</Text>
                    <TouchableOpacity
                        className="bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex-row items-center"
                        onPress={() => setUserRole(prev => prev === 'SECURITY' ? 'MANAGER' : 'SECURITY')}
                    >
                        <User size={12} color="#64748b" className="mr-1.5" />
                        <Text className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">
                            View: {userRole}
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

            {renderFilterModal()}

        </SafeAreaView>
    );
}