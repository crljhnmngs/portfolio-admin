import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
    id?: string;
    name?: string;
    placeholder?: string;
    rows?: number;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string;
    register?: UseFormRegisterReturn;
    maxLength?: number;
    showCharCount?: boolean;
}

const TextArea = ({
    id,
    name,
    placeholder = 'Enter your message',
    rows = 4,
    value,
    defaultValue,
    onChange,
    className = '',
    disabled = false,
    success = false,
    error = false,
    hint = '',
    register,
    maxLength,
    showCharCount = false,
}: TextAreaProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    let textareaClasses = `w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 resize-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

    if (disabled) {
        textareaClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        textareaClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
    } else if (success) {
        textareaClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
    } else {
        textareaClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
        <div className="relative">
            <textarea
                id={id}
                name={name}
                placeholder={placeholder}
                rows={rows}
                value={value}
                defaultValue={defaultValue}
                onChange={handleChange}
                disabled={disabled}
                maxLength={maxLength}
                className={textareaClasses}
                {...register}
            />

            {showCharCount && maxLength && (
                <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500">
                    {value?.length || 0}/{maxLength}
                </div>
            )}

            {hint && (
                <p
                    className={`mt-1.5 text-xs ${
                        error
                            ? 'text-error-500'
                            : success
                            ? 'text-success-500'
                            : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default TextArea;
