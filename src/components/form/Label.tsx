import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface LabelProps {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
}

const Label = ({ htmlFor, children, className }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',

                className
            )}
        >
            {children}
        </label>
    );
};

export default Label;
