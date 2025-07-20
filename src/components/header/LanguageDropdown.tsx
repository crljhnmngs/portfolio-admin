'use client';

import React, { useEffect, useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { useSupportedLanguages } from '@/hooks/useSupportedLanguages';
import toast from 'react-hot-toast';
import { useLanguageStore } from '@/stores/languageStore';

export const LanguageDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { supportedLanguages, isLoading, error } = useSupportedLanguages();

    const selectedLang = useLanguageStore((s) => s.selectedLang);
    const setSelectedLang = useLanguageStore((s) => s.setSelectedLang);
    const resetToDefault = useLanguageStore((s) => s.resetToDefault);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const handleLanguageChange = (code: string) => {
        setSelectedLang(code);
        closeDropdown();
    };

    useEffect(() => {
        if (error) {
            toast.error('Failed to load supported languages');
        }
    }, [error]);

    useEffect(() => {
        if (!isLoading && supportedLanguages?.length) {
            const valid = supportedLanguages.some(
                (l) => l.code === selectedLang
            );
            if (!valid) {
                const fallback =
                    supportedLanguages.find((l) => l.is_default)?.code ||
                    supportedLanguages[0].code;
                resetToDefault(fallback);
            }
        }
    }, [isLoading, supportedLanguages, selectedLang, resetToDefault]);

    return (
        <div className="relative">
            <button
                className="dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={toggleDropdown}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="text-gray-200 animate-spin stroke-brand-500 dark:text-gray-800">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="10"
                                cy="10"
                                r="8.75"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            />
                        </svg>
                    </span>
                ) : (
                    selectedLang.toUpperCase()
                )}
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute left-1.5 lg:right-0 lg:left-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
                <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Select Language
                </div>

                <ul className="flex flex-col">
                    {!isLoading && supportedLanguages?.length
                        ? supportedLanguages.map(({ code, name }) => (
                              <DropdownItem
                                  key={code}
                                  onItemClick={() => handleLanguageChange(code)}
                                  className={`px-4 py-2 hover:bg-gray-100 rounded-sm dark:hover:bg-gray-700 ${
                                      code === selectedLang
                                          ? 'font-semibold text-blue-600 dark:text-blue-400'
                                          : 'dark:text-gray-400'
                                  }`}
                              >
                                  {name}
                              </DropdownItem>
                          ))
                        : !isLoading && (
                              <span className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                                  No languages available
                              </span>
                          )}
                </ul>
            </Dropdown>
        </div>
    );
};
