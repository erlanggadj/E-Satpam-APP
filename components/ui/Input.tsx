import { cn } from '@/lib/utils';
import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
    className?: string;
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
    ({ className, label, error, containerClassName, ...props }, ref) => {
        return (
            <View className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
                {label && (
                    <Text variant="small" className="font-medium text-text-primary ml-1">
                        {label}
                    </Text>
                )}
                <TextInput
                    ref={ref}
                    className={cn(
                        'flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-text-primary font-sans',
                        'focus:border-primary focus:border-2',
                        error && 'border-status-alert',
                        className
                    )}
                    placeholderTextColor="#9CA3AF"
                    {...props}
                />
                {error && (
                    <Text variant="small" color="alert" className="ml-1 mt-0.5">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);
Input.displayName = 'Input';
