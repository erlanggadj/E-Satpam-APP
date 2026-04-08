import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Text } from './Text';

const buttonVariants = cva(
    'flex flex-row items-center justify-center rounded-xl py-3 px-6 active:opacity-80 disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                outline: 'border-2 border-primary bg-transparent',
                ghost: 'bg-transparent',
                secondary: 'bg-gray-200',
                destructive: 'bg-status-alert',
            },
            size: {
                default: 'h-12',
                sm: 'h-9 px-4',
                lg: 'h-14 px-8',
                icon: 'h-12 w-12 p-0',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const buttonTextVariants = cva('font-medium', {
    variants: {
        variant: {
            default: 'text-white',
            outline: 'text-primary',
            ghost: 'text-text-primary',
            secondary: 'text-text-primary',
            destructive: 'text-white',
        },
        size: {
            default: 'text-base',
            sm: 'text-sm',
            lg: 'text-lg',
            icon: 'text-base',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

export interface ButtonProps
    extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
    className?: string;
    textClassName?: string;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<View, ButtonProps>(
    ({ className, variant, size, children, textClassName, ...props }, ref) => {
        return (
            <TouchableOpacity
                ref={ref as any}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            >
                {typeof children === 'string' ? (
                    <Text
                        className={cn(buttonTextVariants({ variant, size, className: textClassName }))}
                    >
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </TouchableOpacity>
        );
    }
);
Button.displayName = 'Button';
