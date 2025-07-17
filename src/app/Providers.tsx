'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/contexts/UserContext';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <ThemeProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                zIndex: 9999,
                            },
                        }}
                    />
                    {children}
                </ThemeProvider>
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </UserProvider>
        </QueryClientProvider>
    );
};

export default Providers;
