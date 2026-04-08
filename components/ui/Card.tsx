import { cn } from '@/lib/utils';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from './Text';

export interface CardProps extends ViewProps {
    className?: string;
}

export const Card = React.forwardRef<View, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <View
                ref={ref}
                className={cn(
                    'rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden',
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<View, ViewProps>(
    ({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn('flex flex-col space-y-1.5 p-5', className)}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentPropsWithoutRef<typeof Text>>(
    ({ className, children, ...props }, ref) => (
        <Text
            ref={ref}
            variant="h3"
            className={cn('font-semibold leading-none tracking-tight', className)}
            {...props}
        >
            {children}
        </Text>
    )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<View, ViewProps>(
    ({ className, ...props }, ref) => (
        <View ref={ref} className={cn('p-5 pt-0', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<View, ViewProps>(
    ({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn('flex flex-row items-center p-5 pt-0', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';
