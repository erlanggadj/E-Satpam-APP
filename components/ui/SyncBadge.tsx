import { CheckCircle2, Clock } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export type StatusType = 'IN' | 'OUT' | 'ACTIVE' | 'SUBMITTED' | 'DEPOSITED' | 'TAKEN' | 'RETURNED' | 'DONE' | string;
export type ModuleType = 'GENERIC' | 'CONTAINER' | 'AFKIR' | 'IZIN' | 'KEYLOG' | 'MUTASI' | 'KEJADIAN' | 'PIKET';

interface SyncBadgeProps {
    status: number;
    business_status?: StatusType;
    moduleType?: ModuleType;
}

export function SyncBadge({ status, business_status, moduleType = 'GENERIC' }: SyncBadgeProps) {
    const isPending = status === 0;

    let colorClass = 'bg-amber-50 border-amber-100';
    let textColorClass = 'text-amber-600';
    let label = 'MENGIRIM...';
    let isBlue = false;

    if (!isPending) {
        colorClass = 'bg-emerald-50 border-emerald-100';
        textColorClass = 'text-emerald-700';

        if (moduleType === 'CONTAINER' || moduleType === 'AFKIR') {
            if (business_status === 'IN') {
                colorClass = 'bg-blue-50 border-blue-100';
                textColorClass = 'text-blue-600';
                label = 'AREA';
                isBlue = true;
            } else {
                label = 'SELESAI';
            }
        }
        else if (moduleType === 'IZIN') {
            if (business_status === 'OUT') {
                colorClass = 'bg-blue-50 border-blue-100';
                textColorClass = 'text-blue-600';
                label = 'LUAR';
                isBlue = true;
            } else {
                label = 'KEMBALI';
            }
        }
        else if (moduleType === 'KEYLOG') {
            if (business_status === 'DEPOSITED') {
                colorClass = 'bg-blue-50 border-blue-100';
                textColorClass = 'text-blue-600';
                label = 'TERSEDIA';
                isBlue = true;
            } else {
                label = 'DIAMBIL';
            }
        }
        else if (moduleType === 'MUTASI') {
            if (business_status === 'ACTIVE') {
                colorClass = 'bg-blue-50 border-blue-100';
                textColorClass = 'text-blue-600';
                label = 'AKTIF';
                isBlue = true;
            } else {
                label = 'SELESAI';
            }
        }
        else if (moduleType === 'KEJADIAN' || moduleType === 'PIKET') {
            label = 'TERKIRIM';
        }
        else {
            label = 'SINKRON';
        }
    }

    return (
        <View className={`px-2 py-1 rounded border flex-row items-center self-start ${colorClass}`}>
            {isPending ? (
                <Clock size={10} color="#d97706" style={{ marginRight: 4 }} />
            ) : (
                <CheckCircle2 size={10} color={isBlue ? "#3b82f6" : "#10b981"} style={{ marginRight: 4 }} />
            )}
            <Text className={`text-[10px] font-bold uppercase tracking-widest ${textColorClass}`}>
                {label}
            </Text>
        </View>
    );
}
