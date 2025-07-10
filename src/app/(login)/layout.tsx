import React from 'react';
import GridShape from '@/components/common/GridShape';
import { ThemeTogglerTwo } from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from '@/context/ThemeContext';
import Link from 'next/link';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <ThemeProvider>
                <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
                    {children}
                    <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
                        <div className="relative items-center justify-center  flex z-1">
                            <GridShape />
                            <div className="flex flex-col items-center max-w-xs">
                                <Link
                                    href="/"
                                    className="mb-2 text-3xl font-extrabold tracking-tight text-gray-200 dark:text-white"
                                    aria-label="CrlJhnMngs Home"
                                >
                                    Crl
                                    <span className="text-brand-500">Jhn</span>
                                    Mngs
                                </Link>
                                <p className="text-sm text-center text-gray-500 dark:text-white/60">
                                    Portfolio Admin
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
};

export default AuthLayout;
