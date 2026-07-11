import React from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: 'bg-green-100 text-green-800 border-green-200',
        secondary: 'bg-gray-100 text-gray-800 border-gray-200',
        destructive: 'bg-red-100 text-red-800 border-red-200',
        outline: 'text-gray-700 border-gray-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return (
        <div
            ref={ref}
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
Badge.displayName = 'Badge';

export { Badge };
