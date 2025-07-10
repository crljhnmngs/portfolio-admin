import React from 'react';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ReactNode } from 'react';

const outfit = Outfit({
    subsets: ['latin'],
});

const RootLayout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <html lang="en">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
