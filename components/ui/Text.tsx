import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

const textVariants = cva('text-text-primary font-sans', {
    variants: {
        variant: {
            h1: 'text-3xl font-bold font-sans',
            h2: 'text-2xl font-bold font-sans',
            h3: 'text-xl font-semibold font-sans',
            p: 'text-base font-sans',
            small: 'text-sm font-sans',
            mono: 'text-base font-mono text-text-secondary',
        },
        color: {
            default: 'text-text-primary',
            secondary: 'text-text-secondary',
            primary: 'text-primary',
            success: 'text-status-success',
            alert: 'text-status-alert',
            pending: 'text-status-pending',
        },
        align: {
            auto: 'text-auto',
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        },
    },
    defaultVariants: {
        variant: 'p',
        color: 'default',
        align: 'auto',
    },
});

export interface TextProps
    extends RNTextProps,
    VariantProps<typeof textVariants> {
    className?: string;
}

export const Text = React.forwardRef<RNText, TextProps>(
    ({ className, variant, color, align, ...props }, ref) => {
        return (
            <RNText
                ref={ref}
                className={cn(textVariants({ variant, color, align, className }))}
                {...props}
            />
        );
    }
);
Text.displayName = 'Text';
